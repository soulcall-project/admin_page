import { getDefaultLayout, IDefaultLayoutPage, IPageHeader } from "@/components/layout/default-layout";
import ProductForm from "@/components/page/sample/product/product-form";
import { useRouter } from "next/router";

const pageHeader: IPageHeader = {
  title: "상담사 등록",
};

const ProductNewPage: IDefaultLayoutPage = () => {
  const router = useRouter();
  const query = router.query;

  return <ProductForm initialValue={query} />;
};

ProductNewPage.getLayout = getDefaultLayout;
ProductNewPage.pageHeader = pageHeader;

export default ProductNewPage;
