import {Calendar} from "@heroui/calendar";
// import {parseDate} from "@internationalized/date";

// export default function CalendarData() {
//   return (
//     <div className="flex gap-x-4">
//       <Calendar aria-label="Date (No Selection)" />
//       <Calendar aria-label="Date (Uncontrolled)" defaultValue={parseDate("2025-02-03")} />
//     </div>
//   );
// }


export default function App() {
  return <Calendar aria-label="Date (Visible Month)" visibleMonths={3} />;
}