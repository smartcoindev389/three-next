import { Fragment } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";

import Logo from "@/assets/icons/logo.png";

/**
 * Generates a styled PDF document displaying an invoice based on provided data.
 * @example
 * functionName({ data: invoiceData })
 * JSX PDF document structure
 * @param {Object} data - The data containing invoice details such as number, dates, billing information, and items.
 * @returns {JSX.Element} The rendered PDF document as JSX.
 * @description
 *   - Styles the document using predefined styles that are typical to PDF documents.
 *   - Formats monetary values using the `Intl.NumberFormat` for currency display.
 *   - Dynamically maps over invoice items to list them in a structured table format.
 *   - Built using the `@react-pdf/renderer` to render PDF documents in a React environment.
 */
const PaymentInvoice = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      color: "#434345",
      lineHeight: 1.2,
    },
    logo: {
      width: 48,
      height: 40,
      marginBottom: 19,
    },
    title: {
      fontSize: 22,
      marginBottom: 20,
    },
    paragraph: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 0,
      textAlign: "justify",
    },
    paragraphBox: {
      marginBottom: 15,
    },
    alignText: {
      flexDirection: "row",
      marginBottom: 6,
    },
    alignTextBorder: {
      flexDirection: "row",
      paddingBottom: 22,
      borderBottom: "1px solid #e6e6e6",
    },
    paragraphLight: {
      fontSize: 15,
      fontWeight: "400",
      marginBottom: 0,
      textAlign: "justify",
      color: "#74788D",
      marginLeft: 5,
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
        <Image alt="logo" src={Logo} style={styles.logo} />
        <View style={styles.paragraphBox}>
          <View style={styles.alignText}>
            <Text style={styles.paragraph}>Invoice:</Text>
            <Text style={styles.paragraphLight}>{data?.number}</Text>
          </View>
          <View style={styles.alignText}>
            <Text style={styles.paragraph}>Invoice Date:</Text>
            <Text style={styles.paragraphLight}>{data?.order_date}</Text>
          </View>
          <View style={styles.alignTextBorder}>
            <Text style={styles.paragraph}>Invoice Amount:</Text>
            <Text style={styles.paragraphLight}>
              {getFormatPrice(data?.total?.grand_total)}
            </Text>
          </View>
        </View>
        <View style={styles.paragraphBox}>
          <Text style={styles.title}>Payment Details</Text>
          <View style={styles.alignText}>
            <Text style={styles.paragraph}>Order ID:</Text>
            <Text style={styles.paragraphLight}>{data?.order_number}</Text>
          </View>
          <View style={styles.alignText}>
            <Text style={styles.paragraph}>Order Date:</Text>
            <Text style={styles.paragraphLight}>{data?.order_date}</Text>
          </View>
        </View>
        <View style={styles.paragraphBox}>
          <View style={styles.alignText}>
            <Text style={styles.paragraph}>Billed To:</Text>
            <Text style={styles.paragraphLight}>
              {data?.billing_address?.firstname +
                " " +
                data?.billing_address?.lastname +
                " "}
              {data?.billing_address?.street?.[0]
                ? data?.billing_address?.street[0]
                : ""}
              {data?.billing_address?.street?.[1]
                ? " " + data?.billing_address?.street[1][1] + " "
                : ""}
              {" " + data?.billing_address?.postcode}
            </Text>
          </View>
        </View>
        <View style={styles.paragraphBox}>
          <View style={styles.alignTextBorder}>
            <Text style={styles.paragraph}>Payment Method:</Text>
            <Text style={styles.paragraphLight}>
              {data?.payment_methods[0].name}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>Order Items</Text>
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
                <Text style={styles.tableCol}>{product?.product_name}</Text>
                <Text style={styles.tableCol}>{product?.quantity_ordered}</Text>
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
              {getFormatPrice(data?.total?.total_tax)}
            </Text>
            <Text style={styles.totalPrice}>
              {getFormatPrice(data?.total?.grand_total)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PaymentInvoice;
