import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrency, fetchCurrency } from "@/lib/redux/slices/Currency";
import StaggeredDropDown from "@/shared/components/(common)/Dropdown/Dropdown";

/**
 * Renders a dropdown component for selecting a currency from available options.
 * @example
 * CurrencyDropdown()
 * <div>...</div>
 * @param {void} - This function does not accept parameters directly.
 * @returns {JSX.Element} A JSX element that renders a dropdown for currency selection.
 * @description
 *   - Utilizes React hooks 'useState', 'useDispatch', and 'useSelector' for state management.
 *   - Initiates a fetch operation for available currencies when the component mounts using 'useEffect'.
 *   - Maps available currencies into a format compatible with the 'StaggeredDropDown' component.
 *   - Provides a mechanism to update selected currency using the 'handleChange' function.
 */
const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const handleChange = (value) => {
    dispatch(setCurrency(value));
  };

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  return (
    <div>
      {currency.availableCurrencies.length && (
        <StaggeredDropDown
          data={currency.availableCurrencies.map((i) => {
            return { name: i, id: i };
          })}
          open={open}
          setOpen={(value) => {
            setOpen(value);
          }}
          value={currency.storeCurrency}
          onSelect={handleChange}
        />
      )}
    </div>
  );
};

export default Dropdown;
