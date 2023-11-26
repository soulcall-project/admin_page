import { IDefaultLayoutPage, IPageHeader, getDefaultLayout } from "@/components/layout/default-layout";
import { CounselorLogList } from "@/components/page/counselor_log/counselor-log-list";

const pageHeader: IPageHeader = {
  title: "상담 로그",
};

const CounselorLog: IDefaultLayoutPage = () => {
  return (
    <>
      <CounselorLogList />
    </>
  );
};

CounselorLog.getLayout = getDefaultLayout;
CounselorLog.pageHeader = pageHeader;

export default CounselorLog;
