import React from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { useCreateCategoryMutation } from "../../services/apiCategory";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type {ICategoryCreate} from "../../services/types.ts";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem.tsx";

const { Title } = Typography;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
};

const AddCategoryPage: React.FC = () => {
    const [form] = Form.useForm<ICategoryCreate>();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const navigate = useNavigate();

    const onFinish = async (values: ICategoryCreate) => {
        try {
            console.log("onFinish", values);
            await createCategory(values).unwrap();
            message.success("Категорію додано успішно!");
            navigate(-1); // перенаправлення назад, як у редагуванні
        } catch (error) {
            console.error(error);
            message.error("Помилка при додаванні категорії");
        }
    };

    return (
        <Card style={{ maxWidth: 600, margin: "20px auto" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    style={{ width: 80 }}
                    aria-label="Назад"
                />

                <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
                    Додавання категорії
                </Title>

                <Form
                    {...layout}
                    form={form}
                    name="add-category"
                    onFinish={onFinish}
                    initialValues={{ name: "", slug: "", description: "" }}
                    scrollToFirstError
                >
                    <Form.Item
                        label="Назва"
                        name="name"
                        rules={[
                            { required: true, message: "Будь ласка, введіть назву!" },
                            { whitespace: true, message: "Назва не може бути порожньою!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Слаг"
                        name="slug"
                        rules={[
                            { required: true, message: "Будь ласка, введіть слаг!" },
                            { whitespace: true, message: "Слаг не може бути порожнім!" },
                            {
                                pattern: /^[a-z0-9\-]+$/,
                                message:
                                    "Слаг має містити лише латинські літери, цифри та дефіси",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Опис" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <ImageUploadFormItem name="image" label="Фоточка" />

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={isLoading} block>
                            Додати категорію
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    );
};

export default AddCategoryPage;