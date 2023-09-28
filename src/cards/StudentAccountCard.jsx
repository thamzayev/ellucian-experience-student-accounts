import { withStyles } from "@ellucian/react-design-system/core/styles";
import { spacing40 } from "@ellucian/react-design-system/core/styles/tokens";
import {
  Typography,
  Divider,
  Button
} from "@ellucian/react-design-system/core";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const styles = () => ({
  card: {
    marginTop: 0,
    marginRight: spacing40,
    marginBottom: 0,
    marginLeft: spacing40
  },
  label: {
    float: "left"
  },
  button: {
    bottom: spacing40,
    right: spacing40,
    position: "absolute"
  }
});

const StudentAccountCard = (props) => {
  const {
    classes,
    cardControl: { setLoadingStatus, setErrorMessage },
    data: { getEthosQuery }
  } = props;
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setLoadingStatus(true);

      try {
        const chargesData = await getEthosQuery({ queryId: "list-charges" });
        const paymentsData = await getEthosQuery({ queryId: "list-payments" });
        const {
          data: {
            studentCharges16: { edges: chargeEdges }
          }
        } = chargesData;
        console.log(chargeEdges);
        const {
          data: {
            studentPayments16: { edges: paymentEdges }
          }
        } = paymentsData;
        const totalCharges =
          Math.round(
            100 *
              chargeEdges.reduce(
                (result, item) => result + item.node.chargedAmount.amount.value,
                0
              )
          ) / 100;
        const totalPayments =
          Math.round(
            100 *
              paymentEdges.reduce(
                (result, item) => result + item.node.amount.value,
                0
              )
          ) / 100;

        setTotalCharges(() => totalCharges);
        setTotalPayments(() => totalPayments);
        setTotal(() => totalCharges-totalPayments);
        setLoadingStatus(false);
      } catch (error) {
        console.log("ethosQuery failed", error);
        setErrorMessage({
          headerMessage: "Fetch failed",
          textMessage:
            "Fetching data from student account has failed. Try again later.",
          iconName: "error",
          iconColor: "#D42828"
        });
      }
    })();
  }, []);

  return (
    <div className={classes.card}>
      <Typography variant="h3" align="right">
        <span className={classes.label}>Total charges:</span> {totalCharges}
        {props.cardInfo.configuration.currency}
      </Typography>
      <Typography variant="h3" align="right">
        <span className={classes.label}>Total payments:</span> {totalPayments}
        {props.cardInfo.configuration.currency}
      </Typography>
      <Divider />
      <Typography variant="h2" align="right">
        <span className={classes.label}>Total balance:</span> {total}
        {props.cardInfo.configuration.currency}
      </Typography>
      <Button
        className={classes.button}
        onClick={() => {
          window.open(props.cardInfo.configuration.buttonUrl, "_blank");
        }}
      >
        Account Details
      </Button>
    </div>
  );
};

StudentAccountCard.propTypes = {
  cardControl: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  cardInfo: PropTypes.object.isRequired
};

export default withStyles(styles)(StudentAccountCard);
