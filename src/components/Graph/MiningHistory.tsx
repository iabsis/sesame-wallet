import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { useEffect, useState } from "react";
import { getStats } from "../../services/stats";
import { Wallet } from "alephium-js";
import dayjs, { Dayjs } from "dayjs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Rectangle, Cell } from "recharts";

interface MiningHistoryProps {
  wallet?: Wallet;
}
const MiningHistory = ({ wallet }: MiningHistoryProps) => {
  const [data, setData] = useState<Array<{ time: string; dayJsDate: Dayjs; tokens: number }>>([]);
  const [focusBar, setFocusBar] = useState(null);

  useEffect(() => {
    if (wallet) {
      getStats(wallet.address)
        .then((stats) => {
          let _data: Array<{ time: string; dayJsDate: Dayjs; tokens: number }> = [];
          stats.forEach((stat) => {
            const dateString = `${dayjs(stat.date).format("Do")}`;
            _data.push({
              time: dateString,
              dayJsDate: dayjs(stat.date),
              tokens: stat.amount,
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
    return `Reward for ${data[0].payload.dayJsDate.format("MMMM D, YYYY")}`;
  };

  const selcetableBar = (props: any) => {
    const { years, fill } = props;
    //business logic here to update fill color explicitly
    //use explicit fill here, or use the additional css class and make a css selector to update fill there
    return <Rectangle radius={20} {...props} fill={fill} className={`recharts-bar-rectangle`} />;
  };

  return (
    <IonCard className="ion-card-primary">
      <IonCardHeader>
        {/* <IonCardSubtitle>Tokens are delivered every Monday</IonCardSubtitle> */}
        <IonCardTitle>Your last 7 days rewards</IonCardTitle>
      </IonCardHeader>

      <IonCardContent style={{ height: "30vh" }}>
        {data && data.length > 0 && (
          <ResponsiveContainer>
            <BarChart
              onClick={(state: any) => {
                if (state.activeTooltipIndex !== undefined) {
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
              <XAxis dataKey="time" />
              <YAxis dataKey="tokens" visibility="hidden" width={0} />
              <Tooltip formatter={formatter} labelFormatter={labelFormatter} />
              <Bar shape={selcetableBar} label={false} dataKey="tokens" fill="rgba(255,255,255, 0.8)">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={focusBar === index ? "rgba(255,255,255, 1)" : "rgba(255,255,255, 0.5)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default MiningHistory;
