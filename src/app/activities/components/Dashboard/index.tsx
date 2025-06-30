"use client";
import { CardsWrapper, Container } from "./styles";
import { ExibitionCard } from "./ExibitionCard";
import { Button } from "@/components/Button";
import { ActivitiesAccumulatorProps } from "@/@types";

interface DashboardProps {
  recordsAmount: number;
  recordsWithActivities: number;
  activities: ActivitiesAccumulatorProps[];
  spreadsheetLink: string;
  startOver: () => void;
}

export function Dashboard({
  recordsAmount,
  recordsWithActivities,
  activities,
  spreadsheetLink,
  startOver,
}: DashboardProps) {
  return (
    <Container>
      <h1>Activities Dashboard</h1>

      <h3>
        <strong>Numbers of Records on the list: </strong>
        {recordsAmount}
      </h3>
      <h3>
        <strong>Numbers of Records which contained activities records: </strong>
        {recordsWithActivities}
      </h3>

      <CardsWrapper>
        {activities.map((item: ActivitiesAccumulatorProps) => (
          <ExibitionCard
            title={item.ActivityType}
            amount={item.count}
            key={`ACTIVITY_KEY_${item.ActivityType}`}
          />
        ))}
      </CardsWrapper>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
        }}
      >
        <Button
          title={"Make Another"}
          isLoading={false}
          variant={"SECONDARY"}
          onClick={startOver}
        />
        <Button
          title={"See Spreadsheet"}
          isLoading={false}
          onClick={() => {
            startOver();
            window.open(spreadsheetLink, "_blank");
          }}
        />
      </div>
    </Container>
  );
}
