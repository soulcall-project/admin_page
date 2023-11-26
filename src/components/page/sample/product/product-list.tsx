import { useProducts } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { DocumentData, Timestamp } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  status: string[];
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;
};

const ProductList = (props: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const router = useRouter();

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    // onChange: onSelectChange,
    onChange: (value: any) => {
      console.log(value);
    },
  };

  const getDatas = async () => {
    const d = await useProducts(props.searchText, props.type, props.status);
    console.log(d);
    setData(d);
  };

  useEffect(() => {
    getDatas();
  }, [props.searchText, props.type, props.status]);

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DocumentData> = [
    {
      title: "순번",
      dataIndex: "id",
      width: 30,
      align: "center",
    },
    {
      title: "UID",
      dataIndex: "uid",
      width: 100,
    },
    {
      title: "유저 이름",
      dataIndex: "display_name",
      width: 100,
    },
    {
      title: "이메일 주소",
      dataIndex: "email",
      align: "center",
      width: 150,
    },
    {
      title: "가입 일자",
      dataIndex: "created_time",
      align: "center",
      width: 100,
      render: (value: Timestamp) => {
        // console.log(value);
        return <>{value ? <div>{new Date(value.seconds * 1000).toDateString()}</div> : <div></div>}</>;
      },
    },
    {
      title: "상담사 여부",
      dataIndex: "is_counselor",
      align: "center",
      width: 120,
      render: (value: boolean) => {
        return <div>{value ? "상담사" : "일반 유저"}</div>;
      },
    },
  ];

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `${selectedRowKeys.length}건 선택` : ""}</span>
        </div>

        <div className="flex-item-list">
          <Button
            type="primary"
            onClick={() => {
              console.log(selectedRowKeys);
              if (selectedRowKeys.length > 1) {
                alert("한명의 유저만 선택해주세요.");
                return;
              } else if (selectedRowKeys.length <= 0) {
                alert("한명의 유저를 선택해주세요.");
                return;
              }

              const user = data[parseInt(selectedRowKeys[0].toString())];
              console.log(user);

              router.push({
                pathname: "/sample/product/new",
                query: {
                  display_name: user.display_name,
                  uid: user.uid,
                  ...user.counselor_profile,
                },
              });
            }}
          >
            상담사 업그레이드
          </Button>
        </div>
      </DefaultTableBtn>

      <DefaultTable<DocumentData>
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        columns={columns}
        dataSource={data || []}
        className="mt-3"
      />
    </>
  );
};

export default React.memo(ProductList);