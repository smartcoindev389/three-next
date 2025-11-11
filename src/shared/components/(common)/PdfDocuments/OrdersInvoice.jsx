"use client";

import { Fragment } from "react";
import {
  Document,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";

import HeaderImage from "@/assets/icons/pdf-header.jpg";

/**
 * Generates a PDF document for order details and customer information.
 * @example
 * generateOrderInvoice({ data, custData })
 * Returns a JSX component rendering a styled PDF document.
 * @param {Object} data - The order information including number, date, status, billing, and shipping details.
 * @param {Object} custData - The customer information including email and phone details.
 * @returns {JSX.Element} A PDF document component structured using React components.
 * @description
 *   - Internally registers the 'SF-Pro' font used for styling the document.
 *   - Styles are defined using React Native's StyleSheet for consistent UI design.
 *   - Formats price values using the `Intl.NumberFormat` API for currency display.
 *   - Handles pre-order notices and stock messages for products within the order item list.
 */
const OrdersInvoice = ({ data, custData }) => {
  Font.register({
    family: "SF-Pro",
    src: "https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-medium-webfont.woff",
  });

  const styles = StyleSheet.create({
    page: {
      fontFamily: "SF-Pro",
      color: "#434345",
      lineHeight: 1.2,
    },
    logo: {
      width: "100vw",
      height: "auto",
    },
    title: {
      fontSize: 22,
      marginBottom: 8,
    },
    paragraph: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 0,
      textAlign: "justify",
    },
    paragraphBox: {
      marginTop: 25,
    },
    alignText: {
      flexDirection: "row",
      marginBottom: 6,
    },
    paragraphLight: {
      fontSize: 15,
      fontWeight: "400",
      marginBottom: 0,
      textAlign: "justify",
      color: "#74788D",
      marginLeft: 5,
    },
    preorderNotice: {
      fontSize: 13,
      fontWeight: "400",
      marginBottom: 0,
      textAlign: "justify",
      color: "#74788D",
      marginLeft: 20,
      marginTop: 7,
    },
    paragraphDetail: {
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 0,
      textAlign: "justify",
      color: "#74788D",
    },
    paragraphDetailLight: {
      fontSize: 13,
      fontWeight: "400",
      marginBottom: 0,
      textAlign: "justify",
      color: "#74788D",
      marginLeft: 5,
    },
    table: {
      display: "table",
      width: "auto",
      marginBottom: 5,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #EBEBEB",
    },
    orderDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 15,
    },
    orderColumn: {
      width: "25%",
    },
    subTotal: {
      marginBottom: 8,
      fontSize: 14,
      color: "#495057",
      fontWeight: "400",
    },
    totalPrice: {
      marginBottom: 8,
      fontSize: 16,
      color: "#495057",
      fontWeight: "700",
    },
    tableColHeader: {
      width: "25%",
      textAlign: "left",
      fontSize: 13,
      fontWeight: "700",
      paddingBottom: 10,
      paddingTop: 10,
    },
    tableCol: {
      width: "25%",
      textAlign: "left",
      fontWeight: "400",
      fontSize: 12,
      color: "#74788D",
      paddingBottom: 10,
      paddingTop: 10,
    },
    noticeText: {
      fontSize: 12,
      color: "#495057",
      fontWeight: "700",
      marginTop: 10,
    },
    wrapper: {
      marginLeft: 60,
      marginRight: 60,
    },
    titleAlign: {
      flexDirection: "row",
      marginBottom: 5,
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#74788D",
    },
  });

  const getFormatPrice = (amount) => {
    if (amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: amount.currency,
        currencyDisplay: "symbol",
      }).format(amount.value);
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image alt="logo" src={HeaderImage.src} style={styles.logo} />
        <View style={styles.wrapper}>
          <Text style={styles.title}>Order Details</Text>
          <Text style={styles.line} />
          <View style={styles.paragraphBox}>
            <View style={styles.alignText}>
              <Text style={styles.paragraph}>Order ID:</Text>
              <Text style={styles.paragraphLight}>{data?.number}</Text>
            </View>
            <View style={styles.alignText}>
              <Text style={styles.paragraph}>Order Date:</Text>
              <Text style={styles.paragraphLight}>{data?.order_date}</Text>
            </View>
            <View style={styles.titleAlign}>
              <Text style={styles.paragraph}>Status:</Text>
              <Text style={styles.paragraphLight}>{data?.status}</Text>
            </View>
          </View>
          <View style={styles.paragraphBox}>
            <View style={styles.alignText}>
              <Text style={styles.paragraph}>Billied To:</Text>
              <Text style={styles.paragraphLight}>
                {data?.billing_address?.firstname +
                  " " +
                  data?.billing_address?.lastname +
                  " "}
                {data?.billing_address?.street?.[0]
                  ? data?.billing_address?.street[0] + " "
                  : ""}
                {data?.billing_address?.city
                  ? data?.billing_address?.city + " "
                  : ""}{" "}
                {data?.billing_address?.region
                  ? data?.billing_address?.region + " "
                  : ""}{" "}
                {data?.billing_address?.country_code
                  ? data?.billing_address?.country_code + ","
                  : ""}{" "}
                {data?.billing_address?.postcode
                  ? data?.billing_address?.postcode
                  : ""}
              </Text>
            </View>
            <View style={styles.alignText}>
              <Text style={styles.paragraphDetail}>Email:</Text>
              <Text style={styles.paragraphDetailLight}>
                {custData?.email
                  ? custData?.email
                  : localStorage.getItem("guestEmail")}
              </Text>
            </View>
            <View style={styles.alignText}>
              <Text style={styles.paragraphDetail}>Phone:</Text>
              <Text style={styles.paragraphDetailLight}>
                {data?.billing_address?.telephone}
              </Text>
            </View>
          </View>
          <View style={styles.paragraphBox}>
            <View style={styles.alignText}>
              <Text style={styles.paragraph}>Shipped To:</Text>
              <Text style={styles.paragraphLight}>
                {data?.shipping_address?.firstname +
                  " " +
                  data?.shipping_address?.lastname +
                  " "}
                {data?.shipping_address?.street?.[0]
                  ? data?.shipping_address?.street[0] + " "
                  : ""}
                {data?.shipping_address?.city
                  ? data.shipping_address?.city + " "
                  : ""}
                {data?.shipping_address?.country_code
                  ? data.shipping_address?.country_code + ", "
                  : ""}
                {data?.shipping_address?.postcode}
              </Text>
            </View>
            <View style={styles.alignText}>
              <Text style={styles.paragraphDetail}>Phone:</Text>
              <Text style={styles.paragraphDetailLight}>
                {data?.shipping_address?.telephone}
              </Text>
            </View>
          </View>
          <View style={styles.paragraphBox}>
            <View style={styles.titleAlign}>
              <Text style={styles.paragraph}>Payment Method:</Text>
              <Text style={styles.paragraphLight}>
                {data?.payment_methods[0].name}
              </Text>
            </View>
          </View>

          <View style={styles.alignText}>
            <Text style={styles.title}>Order Items</Text>
            <Text style={styles.preorderNotice}>
              {data?.mp_pre_order_notice && (
                <>
                  <Svg>
                    <Path
                      d={
                        "M23.9006 14.9531L16.4637 2.55738C15.4876 0.930871 13.9944 0 12.3641 0C10.7338 0 9.24067 0.930871 8.26451 2.55486L0.827606 14.9531C-0.161129 16.5997 -0.269312 18.3558 0.531992 19.7709C1.33204 21.1874 2.89439 22 4.81651 22H19.9117C21.8338 22 23.3962 21.1874 24.1962 19.7722C24.9975 18.357 24.8894 16.6009 23.9006 14.9531ZM12.3641 17.6589C11.2898 17.6589 10.4143 16.7846 10.4143 15.7103C10.4143 14.6348 11.2886 13.7593 12.3641 13.7593C13.4396 13.7593 14.3139 14.6348 14.3139 15.7103C14.3139 16.7846 13.4384 17.6589 12.3641 17.6589ZM14.4183 8.31997C14.4045 8.35897 12.656 12.6825 12.656 12.6825C12.6082 12.8007 12.4924 12.8787 12.3654 12.8787C12.2383 12.8787 12.1226 12.8007 12.0748 12.6825L10.325 8.35771C10.2118 8.06461 10.1627 7.80045 10.1627 7.53376C10.1627 6.31986 11.1502 5.33238 12.3641 5.33238C13.578 5.33238 14.5655 6.31986 14.5655 7.53376C14.5655 7.80045 14.5164 8.06461 14.4183 8.31997Z"
                      }
                    />
                  </Svg>
                  <Text>{data?.mp_pre_order_notice}</Text>
                </>
              )}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Item No.</Text>
              <Text style={styles.tableColHeader}>Product</Text>
              <Text style={styles.tableColHeader}>Quantity</Text>
              <Text style={styles.tableColHeader}>Price</Text>
            </View>
            {data?.items.map((product, index) => (
              <Fragment key={index}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol}>{index + 1}</Text>
                  <View style={styles.tableCol}>
                    <Text>{product?.product_name}</Text>
                    {product?.product.mp_pre_order.stock_notice && (
                      <Text>
                        <Text style={styles.noticeText}>Notice:</Text>{" "}
                        {product?.product.mp_pre_order.stock_notice}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.tableCol}>
                    {product?.quantity_ordered}
                  </Text>
                  <Text style={styles.tableCol}>
                    {getFormatPrice(product?.product_sale_price)}
                  </Text>
                </View>
              </Fragment>
            ))}
          </View>
          <View style={styles.orderDetails}>
            <View style={styles.orderColumn}>
              <Text style={styles.subTotal}>Sub Total</Text>
              <Text style={styles.subTotal}>Shipping Cost</Text>
              <Text style={styles.subTotal}>Processing Fee</Text>
              {data?.total?.discounts?.length > 0 && (
                <Text style={styles.subTotal}>Discounts</Text>
              )}
              <Text style={styles.subTotal}>Tax</Text>
              <Text style={styles.totalPrice}>Total</Text>
            </View>
            <View style={styles.orderColumn}>
              <Text style={styles.subTotal}>
                {getFormatPrice(data?.total?.subtotal)}
              </Text>
              <Text style={styles.subTotal}>
                {getFormatPrice(data?.total?.total_shipping)}
              </Text>
              <Text style={styles.subTotal}>
                {getFormatPrice(data?.total?.payment_fee)}
              </Text>
              {data?.total?.discounts?.length > 0 && (
                <Text style={styles.subTotal}>
                  -{data?.total?.discounts?.[0]?.amount?.value}
                </Text>
              )}
              <Text style={styles.subTotal}>
                {getFormatPrice(data?.total?.total_tax)}
              </Text>
              <Text style={styles.totalPrice}>
                {getFormatPrice(data?.total?.grand_total)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrdersInvoice;
