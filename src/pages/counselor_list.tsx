import { IDefaultLayoutPage, IPageHeader, getDefaultLayout } from "@/components/layout/default-layout";
import { CounselorLogList } from "@/components/page/counselor_log/counselor-log-list";
import CounselorLogSearch from "@/components/page/counselor_log/counselor-log-search";
import { Timestamp } from "firebase/firestore/lite";
import { useState } from "react";

const pageHeader: IPageHeader = {
  title: "상담 로그",
};

const CounselorLog: IDefaultLayoutPage = () => {
  const [start, setStart] = useState<Timestamp | null>(null);
  const [end, setEnd] = useState<Timestamp | null>(null);
  const [type, setType] = useState<string>("all");

  return (
    <>
      <CounselorLogSearch start={start} setStart={setStart} end={end} setEnd={setEnd} type={type} setType={setType} />
      <CounselorLogList start={start} end={end} type={type} />
    </>
  );
};

CounselorLog.getLayout = getDefaultLayout;
CounselorLog.pageHeader = pageHeader;

export default CounselorLog;
