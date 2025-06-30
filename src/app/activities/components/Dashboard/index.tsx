"use client";
import { CardsWrapper, Container, Divisor, SubtitleInfo } from "./styles";
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
      <SubtitleInfo>
        <h3>
          {recordsAmount}
          <strong> records on the list </strong>
        </h3>
        <Divisor/>
        <h3>
          {recordsWithActivities}
          <strong> contain activities</strong>
        </h3>
      </SubtitleInfo>

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
          gap: "2.4rem",
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
