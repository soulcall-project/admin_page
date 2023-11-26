import { useProducts } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
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

const CounselorList = (props: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<DocumentData[]>([]);
  const router = useRouter();

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getDatas = async () => {
    const d = await useProducts(props.searchText, props.type, ["COUNSELOR"]);
    console.log(d);
    setData(d);
  };

  useEffect(() => {
    getDatas();
  }, [props.searchText, props.type, props.status]);

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DocumentData> = [
    {
      title: "순서",
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
      title: "상담 가격",
      dataIndex: "counselor_profile",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value ? value.video_price : "?"}원</div>;
      },
    },
    {
      title: "커리어",
      dataIndex: "counselor_profile",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value ? value.career : "?"}</div>;
      },
    },
    {
      title: "성별",
      dataIndex: "counselor_profile",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value ? value.gender : "?"}</div>;
      },
    },
    {
      title: "등급",
      dataIndex: "counselor_profile",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value ? value.grade : "?"}</div>;
      },
    },
    {
      title: "소개",
      dataIndex: "counselor_profile",
      align: "center",
      width: 250,
      render: (value) => {
        return <div>{value ? value.intro : "?"}</div>;
      },
    },
    {
      title: "상담 방법",
      dataIndex: "counselor_profile",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value ? value.method : "?"}</div>;
      },
    },
    {
      title: "상담 필드",
      dataIndex: "counselor_profile",
      align: "center",
      width: 200,
      render: (value) => {
        return <div>{value ? value.fields.join(", ") : "?"}</div>;
      },
    },
    {
      title: "상담 스타일",
      dataIndex: "counselor_profile",
      align: "center",
      width: 200,
      render: (value) => {
        return <div>{value ? value.styles.join(", ") : "?"}</div>;
      },
    },
  ];

  return (
    <>
      <DefaultTableBtn className="justify-between">
        <div>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `${selectedRowKeys.length}건 선택` : ""}</span>
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

export default React.memo(CounselorList);
