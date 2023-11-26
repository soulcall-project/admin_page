import { IProductFormValue } from "@/client/sample/product";
import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import { Button, Form, Input, Select, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { Props } from "./product-form";

export const ProductForm = ({ initialValue }: Props) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (formValue: IProductFormValue) => {
    try {
      setIsLoading(true);
    } catch (e: unknown) {
      messageApi.error("에러가 발생했습니다");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      {contextHolder}
      <DefaultForm<IProductFormValue> form={form} initialValues={initialValue} onFinish={handleFinish}>
        <FormSection title="상담사 정보" description="상담사의 정보를 입력해주세요.">
          <FormGroup title="상담사명*">
            <Form.Item name="display_name" rules={[{ required: true, message: "필수값입니다" }]}>
              <Input placeholder="상담사명을 입력해주세요." />
            </Form.Item>
          </FormGroup>
        </FormSection>

        <FormSection title="상담사 소개" description="상담사 소개를 입력해주세요">
          <FormGroup title="상담사 소개">
            <Form.Item name="intro">
              <Input.TextArea placeholder="상담사 소개를 입력해주세요." rows={10} />
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담사 성별*">
            <Form.Item name="gender" rules={[{ required: true, message: "필수값입니다" }]}>
              <Select placeholder={"상담사 성별"}>
                <Select.Option value="남자">남자</Select.Option>
                <Select.Option value="여자">여자</Select.Option>
                <Select.Option value="기타">기타</Select.Option>
              </Select>
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="금액*">
            <Form.Item name="price" rules={[{ required: true, message: "필수값입니다" }]}>
              <Input placeholder="금액을 입력하세요" />
            </Form.Item>
          </FormGroup>
        </FormSection>

        <div className="text-center">
          <Button htmlType="submit" type="primary" loading={isLoading}>
            저장
          </Button>
        </div>
      </DefaultForm>
    </>
  );
};
