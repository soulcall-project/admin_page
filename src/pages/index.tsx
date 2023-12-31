import { getDefaultLayout, IDefaultLayoutPage, IPageHeader } from "@/components/layout/default-layout";
import ProductList from "@/components/page/sample/product/product-list";
import ProductSearch from "@/components/page/sample/product/product-search";
import { useState } from "react";

const pageHeader: IPageHeader = {
  title: "일반 유저 관리",
};

const IndexPage: IDefaultLayoutPage = () => {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<string[]>([]);

  return (
    <>
      <ProductSearch
        searchText={searchText}
        setSearchText={setSearchText}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
      />
      <ProductList
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

IndexPage.getLayout = getDefaultLayout;
IndexPage.pageHeader = pageHeader;

export default IndexPage;
