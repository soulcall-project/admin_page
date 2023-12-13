import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, Form } from "antd";
import { DatePicker } from "antd/lib";
import { useForm } from "antd/lib/form/Form";
import { Timestamp } from "firebase/firestore/lite";
import { Search } from "lucide-react";
import React, { useCallback } from "react";

type Props = {
  start: Timestamp | null;
  setStart: React.Dispatch<React.SetStateAction<Timestamp | null>>;
  end: Timestamp | null;
  setEnd: React.Dispatch<React.SetStateAction<Timestamp | null>>;
};

const CounselorLogSearch = (props: Props) => {
  const [form] = useForm();

  const handleFinish = useCallback((formValue: any) => {
    console.log(formValue.date.year(), formValue.date.month(), formValue.date.day());

    const start = new Date(formValue.date.year(), formValue.date.month(), 1);
    const end = new Date(formValue.date.year(), formValue.date.month() + 1, 0);

    console.log(start, end);
    console.log(Timestamp.fromDate(start), Timestamp.fromDate(end));
    // props.setDate(formValue.date);
    const startStamp = Timestamp.fromDate(start);
    const endStamp = Timestamp.fromDate(end);

    props.setStart(startStamp);
    props.setEnd(endStamp);
  }, []);

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <div>
          <FieldInline>
            <Form.Item name="date">
              <DatePicker allowClear={false} />
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

export default React.memo(CounselorLogSearch);
