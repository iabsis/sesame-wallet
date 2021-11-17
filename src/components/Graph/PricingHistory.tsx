import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { useEffect, useState } from "react";
import { getHistory } from "../../services/stats";
import { Wallet } from "alephium-js";
import dayjs, { Dayjs } from "dayjs";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Rectangle, Cell, LineChart, Line } from "recharts";

interface PriceHistoryProps {
  wallet?: Wallet;
}
const PriceHistory = ({ wallet }: PriceHistoryProps) => {
  const [data, setData] = useState<Array<{ time: string; dayJsDate: Dayjs; bestPrice: number }>>([]);
  const [focusBar, setFocusBar] = useState(null);

  useEffect(() => {
    if (wallet) {
      getHistory()
        .then((stats) => {
          let _data: Array<{ time: string; dayJsDate: Dayjs; bestPrice: number }> = [];
          stats.forEach((stat) => {
            const dateString = `${dayjs(stat.date).format(" MMM Do ")}`;
            _data.push({
              time: dateString,
              dayJsDate: dayjs(stat.date),
              bestPrice: stat.bestPrice,
            });
          });
          setData(_data);
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    }
  }, [wallet]);

  const formatter = (value: number) => {
    return `${value.toFixed(4)} ALEPH`;
  };

  const labelFormatter = (value: string, data: any) => {
    if (!data[0]) {
      return "";
    }
    return `Reward for ${data[0].payload.dayJsDate.format("MMMM Do, YYYY")}`;
  };

  return (
    <IonCard className="ion-card-alt">
      <IonCardHeader>
        <IonCardSubtitle>* Based on the best plan</IonCardSubtitle>
        <IonCardTitle>
          Price history <span className="accent">*</span>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent style={{ height: "30vh" }}>
        {data && data.length > 0 && (
          <ResponsiveContainer>
            <LineChart
              onClick={(state: any) => {
                if (state.activeTooltipIndex) {
                  setFocusBar(state.activeTooltipIndex);
                } else {
                  setFocusBar(null);
                }
              }}
              className="diagramm"
              width={window.innerWidth}
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="7 7" strokeOpacity="0.5" />
              <XAxis dataKey="time" interval="preserveStartEnd" />
              <YAxis dataKey="bestPrice" visibility="hidden" width={0} />
              <Tooltip formatter={formatter} labelFormatter={labelFormatter} />
              <Line dataKey="bestPrice" fill="rgba(255,255,255, 0.8)" strokeWidth={2} markerWidth={5}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={focusBar === index ? "rgba(255,255,255, 1)" : "rgba(255,255,255, 0.5)"} />
                ))}
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PriceHistory;
