import { getProducts } from "@/client/sample/product";
import DefaultTable from "@/components/shared/ui/default-table";
import DefaultTableBtn from "@/components/shared/ui/default-table-btn";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { db } from "firebase-instanse";
import { DocumentData, Timestamp, doc, getDoc, updateDoc } from "firebase/firestore/lite";
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

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const getDatas = async () => {
    const d = await getProducts(props.searchText, props.type, ["COUNSELOR"]);
    console.log(d);
    setData(d);
  };

  const router = useRouter();

  useEffect(() => {
    getDatas();
  }, [props.searchText, props.status, props.type]);

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
        return <div>{value ? value.price_per_10m : "?"}원</div>;
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

              const updateData = {
                is_counselor: false,
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
            상담사 다운그레이드
          </Button>
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

              const user = data[parseInt(selectedRowKeys[0].toString()) - 1];
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
            상담사 수정
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

export default React.memo(CounselorList);
