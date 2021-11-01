import { IonPage } from "@ionic/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

import QRCode from "qrcode.react";
import { useContext, useEffect, useState } from "react";

import { useTheme } from "styled-components";

import { GlobalContext } from "../App";
import { Transaction } from "alephium-js/dist/api/api-explorer";
import { abbreviateAmount, calAmountDelta } from "../utils/misc";
import dayjs from "dayjs";

import { getWalletTransactions } from "../services/alephExplorer";

const GraphicsPage = () => {
  let indexes: any = {};
  // let data: any = [];

  const [data, setData] = useState<Array<{ time: string; tokens: number }>>([]);

  const theme = useTheme();

  console.log("DATA", indexes, data);

  const { wallet, client } = useContext(GlobalContext);
  const QUINTILLION = 10000000000000000n;

  const convertTransToAmount = (transaction: Transaction, currentAddress: string) => {
    const amountDelta = calAmountDelta(transaction, currentAddress);

    const date: string = dayjs(transaction.timestamp).format("MM-DD");
    // abbreviateAmount;
    return {
      date,
      amount: amountDelta < 0 ? amountDelta * -1n : amountDelta,
    };
  };

  useEffect(() => {
    if (wallet && client) {
      getWalletTransactions(wallet.address, 750).then((transactions) => {
        console.log("Got transactions list", transactions);
        let _data: Array<{ time: string; tokens: number }> = [];
        for (let i = 7; i > 0; i--) {
          const dateString = dayjs(new Date()).subtract(i, "day").format("MM-DD");
          indexes[dateString] = 7 - i;
          _data.push({
            time: dateString,
            tokens: 0,
          });
        }
        transactions.forEach((transaction) => {
          const converted = convertTransToAmount(transaction, wallet.address);
          const index = indexes[converted.date];
          console.log("index", index);
          if (_data[index] !== undefined) {
            _data[index].tokens += parseFloat(abbreviateAmount(converted.amount));
          }
        });
        console.log("values", _data);
        setData(_data);
      });
    }
  }, [wallet, client]);
  return (
    <IonPage>
      <h1 className="page-title">Your statistics</h1>
      <p className="page-subtitle">Below, you will find your daily statistcs for the last week.</p>
      {data && data.length > 0 && (
        <ResponsiveContainer>
          <BarChart className="diagramm" width={window.innerWidth} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="7 7" />
            <XAxis dataKey="time" textDecoration="t" />
            <YAxis dataKey="tokens" />
            <Bar label={false} dataKey="tokens" fill={theme.global.accent} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </IonPage>
  );
};

export default GraphicsPage;
