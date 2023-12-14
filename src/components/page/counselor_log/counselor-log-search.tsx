import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, Form, Select } from "antd";
import { DatePicker } from "antd/lib";
import { useForm } from "antd/lib/form/Form";
import { Timestamp } from "firebase/firestore/lite";
import { Search } from "lucide-react";
import React, { useCallback, useState } from "react";

type Props = {
  start: Timestamp | null;
  setStart: React.Dispatch<React.SetStateAction<Timestamp | null>>;
  end: Timestamp | null;
  setEnd: React.Dispatch<React.SetStateAction<Timestamp | null>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
};

const CounselorLogSearch = (props: Props) => {
  const [form] = useForm();
  const [date, setDate] = useState("");

  const handleFinish = useCallback((formValue: any) => {
    if (formValue.date) {
      console.log(formValue.date.year(), formValue.date.month(), formValue.date.day());
      const start = new Date(formValue.date.year(), formValue.date.month(), 1);
      const end = formValue.date.toDate();

      setDate(
        `${formValue.date.year()}-${
          formValue.date.month() < 10 ? `0${formValue.date.month()}` : formValue.date.month()
        }-01`
      );

      console.log(start, end);
      console.log(Timestamp.fromDate(start), Timestamp.fromDate(end));
      // props.setDate(formValue.date);
      const startStamp = Timestamp.fromDate(start);
      const endStamp = Timestamp.fromDate(end);

      props.setStart(startStamp);
      props.setEnd(endStamp);
    }
    console.log(formValue.type);
    props.setType(formValue.type);
  }, []);

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <div>
          <Form.Item label="검색조건" name="type" initialValue="all">
            <Select dropdownMatchSelectWidth={false}>
              <Select.Option value="all">전체</Select.Option>
              <Select.Option value="payment_finish">정산 완료</Select.Option>
              <Select.Option value="finish">정산대기중(결제완료)</Select.Option>
              <Select.Option value="wait">결제 대기중</Select.Option>
            </Select>
          </Form.Item>
          <FieldInline>
            <Form.Item label="검색할 날짜" name="date">
              {date && (
                <>
                  <div>{date} ~ </div>
                </>
              )}
              <DatePicker allowClear={true} />
            </Form.Item>
          </FieldInline>
        </div>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search />}>
          검색
        </Button>
        <Button
          htmlType="submit"
          className="btn-with-icon"
          onClick={() => {
            setDate("");
            form.resetFields();
          }}
        >
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(CounselorLogSearch);
