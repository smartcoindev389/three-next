import { usePlacesWidget } from "react-google-autocomplete";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { COUNTRIES } from "@/lib/apollo/queryes/others";

/**
 * Displays an address form with autocomplete functionality.
 * @example
 * AutocompleteAddressForm({
 *   address: { street: '123 Main St', city: 'Sample City', country: 'US' },
 *   callback: function(data) { console.log(data); },
 *   editMode: true,
 *   inputStyle: 'custom-style',
 *   changePinCode: (code) => { console.log("New Pin Code:", code); },
 *   profilePage: true,
 *   className: 'address-form',
 *   addressClassName: 'address-field',
 *   inputFieldStyle: 'field-style',
 *   editedAddress: { ... }
 * })
 * // Renders form and logs changes in address fields.
 * @param {Object} params - Parameters for the address form.
 * @param {Object} params.address - Initial address object containing fields like street, city, etc.
 * @param {Function} params.callback - Function to call on address form updates with the current autocomplete data.
 * @param {boolean} [params.editMode=false] - Whether the form is in edit mode.
 * @param {string} [params.inputStyle=""] - CSS style class applied to input fields.
 * @param {Function} params.changePinCode - Function to change the postal code on profile pages.
 * @param {boolean} [params.profilePage=false] - Flag indicating if this is the profile page.
 * @param {string} [params.className=""] - CSS class name for the form container.
 * @param {string} [params.addressClassName=""] - CSS class name for the address container.
 * @param {string} [params.inputFieldStyle=""] - Additional styles applied to input fields.
 * @param {Object} params.editedAddress - The edited address object containing new address values.
 * @returns {JSX.Element} The rendered address form component.
 * @description
 *   - Utilizes Google Maps API for autocomplete suggestions.
 *   - Dynamically reloads regions based on country selection.
 *   - Calls the callback function with updated address data.
 *   - Updates the address form fields and triggers a callback on changes.
 */
export default function AutocompleteAddressForm({
  address,
  callback = () => undefined,
  inputStyle = "",
  changePinCode,
  profilePage = false,
  inputFieldStyle = "",
}) {
  const { t, i18n } = useTranslation();
  const [autocomplete, setAutocomplete] = useState({ address });
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [regions, setRegions] = useState([]);
  const [place, setPlace] = useState(null);
  const { data: countryReq, loading: countryReqLoading } = useQuery(COUNTRIES);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;
  const { ref } = usePlacesWidget({
    apiKey: key,
    onPlaceSelected: (place) => {
      setPlace(place);
    },
  });

  useEffect(() => {
    callback(autocomplete);
  }, [autocomplete]);

  const handleCountryChange = useCallback((country_code) => {
    setCountry(country_code);
    setAutocomplete((prevState) => ({
      ...prevState,
      country: country_code,
    }));
    reloadRegions();
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAutocomplete({
      ...autocomplete,
      [name]: value,
    });
    if (name === "postcode" && profilePage) {
      changePinCode(value);
    }
    callback(autocomplete);
  };

  const reloadRegions = useCallback(() => {
    let tmp;

    tmp =
      countries.find((i) => i?.id === country) ||
      countryReq.countries?.find((x) => x.id === address?.country_code) ||
      {};

    if (tmp?.available_regions) {
      const add = [{ id: "", name: "---select---" }, ...tmp?.available_regions];

      setRegions(add || []);
    } else {
      setRegions([]);
    }
    if (!tmp?.available_regions) {
      setAutocomplete((prevState) => ({
        ...prevState,
        region: null,
        region_id: 0,
      }));
    }
  }, [address?.country_code, countries, country, countryReq?.countries]);

  useEffect(() => {
    if (!countryReqLoading) {
      const country = [
        { id: "", full_name_english: "---select---" },
        ...countryReq.countries,
      ];

      setCountries(country);
      handleCountryChange(address?.country);
    }
  }, [countryReqLoading, address?.country, countryReq?.countries]);

  useEffect(() => {
    if (place && Array.isArray(place.address_components)) {
      const components = place.address_components.reverse();
      let country = null,
        obj = {};

      for (const pl of components) {
        if (pl.types.includes("country")) {
          country = pl.short_name;
          obj.country = pl.short_name;
          setCountry(country);
        }
        if (pl.types.includes("postal_code")) {
          obj.postcode = pl.short_name;
        }
        if (pl.types.includes("administrative_area_level_2")) {
          obj.city = pl.short_name;
          obj.street = pl.short_name;
        }
        if (pl.types.includes("administrative_area_level_3")) {
          obj.street = pl.short_name;
        }
        if (pl.types.includes("administrative_area_level_1")) {
          const countri = countries.find((c) => c.id === country) || {};

          if (countri.available_regions) {
            const region = countri.available_regions.find(
              (r) => r.code === pl.short_name,
            );

            if (region) {
              obj.region = region.code;
              obj.region_id = region.id;
            }
          }
        }
      }
      const data = { ...autocomplete, ...obj };

      setAutocomplete(data);
      if (obj?.country !== "") {
        callback(data, obj.region);
      }
    }
  }, [place]);

  useEffect(() => {
    if (countryReq) {
      reloadRegions();
    }
  }, [autocomplete.country]);

  useEffect(() => {
    if (address) {
      setAutocomplete(address);
    }
  }, [address]);
  const getStyle = () => {
    let styleCss = "mt-1 py-2.5 w-full border-gray-300 rounded-md";

    if (inputStyle) {
      styleCss = inputStyle;
    }

    return styleCss;
  };

  return (
    <div className="flex flex-wrap mt-8">
      <div className="w-full">
        <div className={inputFieldStyle}>
          <label className="block text-gray-700" htmlFor="firstName">
            {t("Street Address")}
            <span className="text-[#F25353] ml-1">*</span>
          </label>
          <input
            ref={ref}
            required
            autoComplete="off"
            className={getStyle()}
            name="street"
            placeholder={t("Enter Address Line")}
            value={autocomplete?.street ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-2 items-end gap-y-5 mt-5 w-full">
        <div className="">
          <label className="block text-gray-700" htmlFor="country">
            {t("Country")}
            <span className="text-[#F25353] ml-1">*</span>
          </label>

          <select
            required
            autoComplete="off"
            className={getStyle() + " mb-0"}
            name="country"
            value={autocomplete?.country}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            {countries
              ?.sort((a, b) =>
                a.full_name_english.localeCompare(b.full_name_english),
              )
              .map((item, index) => (
                <option key={index} value={item.id}>
                  {item.full_name_english}
                </option>
              ))}
          </select>
        </div>
        <div className={inputFieldStyle}>
          <label className="block text-gray-700" htmlFor="region">
            {t("State / Province / Region")}
            <span className="text-[#F25353] ml-1">*</span>
          </label>
          {regions.length > 0 && (
            <select
              required
              autoComplete="off"
              className={getStyle() + " mb-0"}
              name="region_id"
              value={autocomplete?.region_id}
              onChange={handleChange}
            >
              {regions.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          )}
          {!regions.length && (
            <input
              required
              autoComplete="off"
              className={getStyle()}
              name="region"
              value={autocomplete?.region ?? ""}
              onChange={handleChange}
            />
          )}
        </div>
        <div className={inputFieldStyle}>
          <label className="block text-gray-700" htmlFor="city">
            {t("City")}
            <span className="text-[#F25353] ml-1">*</span>
          </label>
          <input
            required
            autoComplete="off"
            className={getStyle()}
            name="city"
            value={autocomplete?.city ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="">
          <label className="block text-gray-700" htmlFor="firstName">
            {t("Zip / Postal code")}
            <span className="text-[#F25353] ml-1">*</span>
          </label>

          <input
            required
            autoComplete="off"
            className={getStyle()}
            name="postcode"
            placeholder={t("Postcode")}
            type="text"
            value={autocomplete?.postcode ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
