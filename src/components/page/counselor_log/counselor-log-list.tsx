import { getCounselor } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { ColumnsType } from "antd/es/table";
import { DocumentData, Timestamp } from "firebase/firestore/lite";
import React, { useCallback, useEffect, useState } from "react";

export const CounselorLogList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<DocumentData[]>([]);

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
        const date = new Date(value.seconds * 1000);
        // console.log(value);
        return (
          <div>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`}</div>
        );
      },
    },
    {
      title: "상담 종료 시간",
      dataIndex: "end_at",
      width: 150,
      render: (value: Timestamp) => {
        const date = new Date(value.seconds * 1000);
        // console.log(value);
        return (
          <>
            {value ? (
              <div>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`}</div>
            ) : (
              <div></div>
            )}
          </>
        );
      },
    },
    {
      title: "상담 가격",
      dataIndex: "counselorData",
      align: "center",
      width: 100,
      render: (value) => {
        const price = value.counselor_profile.price_per_10m * Math.ceil(value.seconds / 60 / 10);
        console.log(value);

        return <div>{price}원</div>;
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
