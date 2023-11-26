import { IDefaultLayoutPage, IPageHeader, getDefaultLayout } from "@/components/layout/default-layout";
import CounselorList from "@/components/page/counselor/counselor-list";
import CounselorSearch from "@/components/page/counselor/counselor-search";
import { useState } from "react";

const pageHeader: IPageHeader = {
  title: "상담사 관리",
};

const Counsler: IDefaultLayoutPage = () => {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<string[]>([]);

  return (
    <>
      <CounselorSearch
        searchText={searchText}
        setSearchText={setSearchText}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
      />
      <CounselorList
        searchText={searchText}
        setSearchText={setSearchText}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
      />
    </>
  );
};

Counsler.pageHeader = pageHeader;
Counsler.getLayout = getDefaultLayout;

export default Counsler;
