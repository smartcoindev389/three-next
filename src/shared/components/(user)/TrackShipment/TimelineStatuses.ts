interface Status {
  color: string;
  iconSrc: string;
}

const statuses: { [key: string]: Status } = {
  ["Info Received"]: {
    color: "#364760",
    iconSrc: "/assets/shipment-timeline/delivered.svg",
  },
  602: {
    color: "",
    iconSrc: "/assets/shipment-timeline/delivered.svg",
  },
  Delivered: {
    color: "#53BA8A",
    iconSrc: "/assets/shipment-timeline/delivered.svg",
  },
};

export default statuses;
