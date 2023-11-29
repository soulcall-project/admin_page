import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const statusOptions = [
  { label: "유저", value: "USER" },
  { label: "상담사", value: "COUNSLER" },
];

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  status: string[];
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;
};

const CounselorSearch = (props: Props) => {
  const [form] = useForm();
  const router = useRouter();

  const handleFinish = useCallback(
    (formValue: any) => {
      // router.push({
      //   pathname: router.pathname,
      //   query: { ...router.query, ...formValue },
      // });
      console.log(formValue);

      props.setSearchText(formValue.searchText ? formValue.searchText : "");
      props.setStatus(["COUNSELOR"]);
      props.setType(formValue.searchType ? formValue.searchType : "");
    },
    []
  );

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <div>
          <FieldInline>
            <Form.Item label="검색조건" name="searchType" initialValue="userName">
              <Select dropdownMatchSelectWidth={false}>
                <Select.Option value="email">이메일</Select.Option>
                <Select.Option value="userName">유저이름</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="searchText" className="grow">
              <Input placeholder="검색어를 입력해주세요" />
            </Form.Item>
          </FieldInline>
        </div>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search />}>
          검색
        </Button>
        <Button htmlType="submit" className="btn-with-icon" onClick={() => form.resetFields()}>
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(CounselorSearch);
