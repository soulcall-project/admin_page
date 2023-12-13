import { getCounselor } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { db } from "firebase-instanse";
import { DocumentData, Timestamp, doc, getDoc, updateDoc } from "firebase/firestore/lite";
import router from "next/router";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  start: Timestamp | null;
  end: Timestamp | null;
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
    const d = await getCounselor(props.start, props.end);
    console.log(d);
    setData(d);
  };

  useEffect(() => {
    getDatas();
  }, [props.start, props.end]);

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
        const date = new Date(value.seconds * 1000);
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
            onClick={async () => {
              console.log(selectedRowKeys);
              if (selectedRowKeys.length > 1) {
                alert("한명의 유저만 선택해주세요.");
                return;
              } else if (selectedRowKeys.length <= 0) {
                alert("한명의 유저를 선택해주세요.");
                return;
              }

              const user = data[parseInt(selectedRowKeys[0].toString()) - 1];
              console.log(user);

              const date = new Date();

              const updateData = {
                banned_at: date.setMonth(date.getMonth() + 3),
              };

              console.log(updateData);

              const userDoc = doc(db, `user`, `${user.uid}`);
              const users = await getDoc(userDoc);
              console.log(users.data());

              await updateDoc(userDoc, updateData);

              const user2 = await getDoc(userDoc);
              console.log(user2.data());

              alert("성공적으로 상담사로 업그레이드 했습니다.");
              router.reload();
            }}
          >
            강제 탈퇴
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
