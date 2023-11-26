import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import { Button, Divider, Form, Input, InputNumber, Select, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { db, storage } from "firebase-instanse";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";

type Props = {
  initialValue: any;
};

type FormValue = {
  display_name: string;
  gender: string;
  styles: string[];
  fields: string[];
  method: string;
  grade: string;
  video_price: number;
  intro: string;
};

const ProductForm = ({ initialValue }: Props) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [profileImage, setProfileImage] = useState<File>();

  const router = useRouter();

  const handleFinish = async (formValue: FormValue) => {
    // try {
    //   setIsLoading(true);
    // } catch (e: unknown) {
    //   messageApi.error("에러가 발생했습니다");
    // } finally {
    //   setTimeout(() => setIsLoading(false), 500);
    // }
    console.log(formValue);

    console.log(initialValue);

    if (!profileImage) {
      alert("상담사 프로필 이미지를 등록해주세요.");
      return;
    }

    const storageRef = ref(storage, `users/${initialValue.uid}/uploads/${profileImage.name}`);
    await uploadBytes(storageRef, profileImage);

    const fileUrl = await getDownloadURL(storageRef);

    const updateData = {
      is_counselor: true,
      display_name: formValue.display_name,
      photo_url: fileUrl,
      counselor_profile: {
        intro: formValue.intro,
        method: formValue.method,
        grade: formValue.grade,
        gender: formValue.gender,
        fields: formValue.fields,
        styles: formValue.styles,
        video_price: formValue.video_price,
        voice_price: formValue.video_price,
      },
    };

    console.log(updateData);

    const userDoc = doc(db, `user`, `${initialValue.uid}`);
    const user = await getDoc(userDoc);
    console.log(user.data());

    await updateDoc(userDoc, updateData);

    const user2 = await getDoc(userDoc);
    console.log(user2.data());

    alert("성공적으로 상담사로 업그레이드 했습니다.");
    router.back();
  };

  return (
    <>
      {contextHolder}
      <DefaultForm<FormValue> form={form} initialValues={initialValue} onFinish={handleFinish}>
        <FormSection title="기본 정보" description="상담사의 정보를 입력해주세요.">
          <FormGroup title="상담사명*">
            <Form.Item name="display_name" rules={[{ required: true, message: "필수값입니다" }]}>
              <Input placeholder="상담사명을 입력해주세요." />
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담사 프로필">
            <Form.Item name="photo_url">
              <Input
                type={"file"}
                onChange={(e) => {
                  setProfileImage(e.target.files![0]);
                }}
              />
            </Form.Item>
          </FormGroup>
        </FormSection>

        <FormSection title="상담사 정보" description="상담사의 정보를 입력해주세요">
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

          <FormGroup title="상담사 등급*">
            <Form.Item name="grade" rules={[{ required: true, message: "필수값입니다" }]}>
              <Input placeholder="상담사의 등급을 입력하세요." />
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담사 스타일*">
            <Form.Item name="styles" rules={[{ required: true, message: "필수값입니다" }]}>
              <Select placeholder={"상담 스타일"} mode={"multiple"}>
                <Select.Option value="문제 해결방법, 스킬을 제안하는">문제 해결방법, 스킬을 제안하는</Select.Option>
                <Select.Option value="공감, 지지 및 위로해주는">공감, 지지 및 위로해주는</Select.Option>
                <Select.Option value="새로운 나를 알게 해주는">새로운 나를 알게 해주는</Select.Option>
                <Select.Option value="트라우마 및 과거를 탐구하는">트라우마 및 과거를 탐구하는</Select.Option>
                <Select.Option value="능동적으로 과제 참여를 유도하는">능동적으로 과제 참여를 유도하는</Select.Option>
              </Select>
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담 분야*">
            <Form.Item name="fields" rules={[{ required: true, message: "필수값입니다" }]}>
              <Select placeholder={"상담 분야"} mode={"multiple"}>
                <Select.Option value="부부생활 / 연애">부부생활 / 연애</Select.Option>
                <Select.Option value="우울/불안/트라우마">우울/불안/트라우마</Select.Option>
                <Select.Option value="이별/이혼">이별/이혼</Select.Option>
                <Select.Option value="법적 문제 관련">법적 문제 관련</Select.Option>
                <Select.Option value="취업/진로/직장">취업/진로/직장</Select.Option>
                <Select.Option value="가족">가족</Select.Option>
                <Select.Option value="기타(자아, LGBT 등)">기타(자아, LGBT 등)</Select.Option>
              </Select>
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담금액*">
            <Form.Item name="video_price" rules={[{ required: true, message: "필수값입니다" }]}>
              <InputNumber placeholder="상담금액을 입력하세요" />
            </Form.Item>
          </FormGroup>

          <Divider />

          <FormGroup title="상담사 소개*">
            <Form.Item name="intro" rules={[{ required: true, message: "필수값입니다." }]}>
              <Input.TextArea placeholder="상담사 소개를 입력해주세요." rows={10} />
            </Form.Item>
          </FormGroup>

          <FormGroup title="상담 방법*">
            <Form.Item name="method" rules={[{ required: true, message: "필수값입니다." }]}>
              <Input.TextArea placeholder="상담 방법을 입력해주세요." rows={10} />
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

export default React.memo(ProductForm);
