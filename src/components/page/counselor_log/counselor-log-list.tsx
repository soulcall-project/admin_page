import { getCounselor } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { db } from "firebase-instanse";
import { DocumentData, Timestamp, doc, getDoc, updateDoc } from "firebase/firestore/lite";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  start: Timestamp | null;
  end: Timestamp | null;
  type: string;
};

export const CounselorLogList = (props: Props) => {
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
    const d = await getCounselor(props.type, props.start, props.end);
    console.log(d);
    setData(d);
  };

  useEffect(() => {
    getDatas();
  }, [props.start, props.end, props.type]);

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
        const date = value.toDate();
        // console.log(value);
        return (
          <div>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`}</div>
        );
      },
    },
    {
      title: "상담 종료 시간",
      dataIndex: "end_at",
      width: 150,
      render: (value: Timestamp) => {
        const date = value.toDate();
        // console.log(value);
        return (
          <>
            {value ? (
              <div>{`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${
                date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
              }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`}</div>
            ) : (
              <div></div>
            )}
          </>
        );
      },
    },
    {
      title: "총 상담시간",
      dataIndex: "seconds",
      align: "center",
      width: 100,
      render: (value) => {
        // const price = value.counselor_profile.price_per_10m * Math.ceil(value.seconds / 60 / 10);
        // console.log(value);

        return <div>{value / 60}분</div>;
      },
    },
    {
      title: "상담 가격",
      dataIndex: "",
      align: "center",
      width: 100,
      render: (value) => {
        // const price = value.counselor_profile.price_per_10m * Math.ceil(value.seconds / 60 / 10);
        // console.log(value);

        return <div>{value.price_amount}원</div>;
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
    //waiting, confirm, finish, cancel, cancel_counselor
    {
      title: "상담 상태",
      dataIndex: "status",
      align: "center",
      width: 200,
      render(value, record, index) {
        switch (value) {
          case "wait":
            return <div>상담 요청</div>;
          case "confirm":
            return <div>상담자 상담 수락</div>;
          case "cancel":
            return <div>내담자 사용 취소</div>;
          case "cancel_counselor":
            return <div>상담자 사용 취소</div>;
          case "finish":
            return <div>상담 종료(결제완료)</div>;
          default:
            return <div></div>;
        }
      },
    },
    {
      title: "정산 처리 여부",
      dataIndex: "status",
      align: "center",
      width: 200,
      render(value, record, index) {
        return value !== "finish" ? (
          <div>결제 대기중</div>
        ) : (
          <Select
            defaultValue={record.is_counselor_finish ?? "false"}
            dropdownMatchSelectWidth={false}
            onChange={async (value) => {
              console.log(value);
              console.log(record.status);

              const updateData = {
                is_payment_finish: value === "true",
              };

              console.log(updateData);

              const userDoc = doc(db, "counseling_log", record.docs);
              const users = await getDoc(userDoc);
              console.log(users.data());

              await updateDoc(userDoc, updateData);

              const user2 = await getDoc(userDoc);
              console.log(user2.data());

              alert("성공적으로 정산처리 했습니다.");
            }}
          >
            <Select.Option value="true">정산 완료</Select.Option>
            <Select.Option value="false">정산대기중(결제완료)</Select.Option>
          </Select>
        );
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
