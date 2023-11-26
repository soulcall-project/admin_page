import { getCounselor } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { ColumnsType } from "antd/es/table";
import { DocumentData, Timestamp } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

export const CounselorLogList = () => {
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
    const d = await getCounselor();
    console.log(d);
    setData(d);
  };

  useEffect(() => {
    getDatas();
  }, []);

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DocumentData> = [
    {
      title: "상담 타입",
      dataIndex: "call_type",
      width: 100,
    },
    {
      title: "상담 시작 시간",
      dataIndex: "start_at",
      width: 150,
      render: (value: Timestamp) => {
        // console.log(value);
        return <>{value ? <div>{new Date(value.seconds * 1000).toISOString()}</div> : <div></div>}</>;
      },
    },
    {
      title: "상담 시작 시간",
      dataIndex: "end_at",
      width: 150,
      render: (value: Timestamp) => {
        // console.log(value);
        return <>{value ? <div>{new Date(value.seconds * 1000).toISOString()}</div> : <div></div>}</>;
      },
    },
    {
      title: "상담 가격",
      dataIndex: "counselorData",
      align: "center",
      width: 100,
      render: (value) => {
        return <div>{value.counselor_profile.video_price}원</div>;
      },
    },
    {
      title: "상담사 이름",
      dataIndex: "counselorData",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value.display_name}</div>;
      },
    },
    {
      title: "상담사 이름",
      dataIndex: "userData",
      align: "center",
      width: 120,
      render: (value) => {
        return <div>{value.display_name}</div>;
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
