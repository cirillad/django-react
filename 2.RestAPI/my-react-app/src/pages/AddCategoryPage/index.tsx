import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useCreateCategoryMutation } from "../../services/apiCategory";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { ICategoryCreate } from "../../services/types.ts";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem.tsx";
import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;

const AddCategoryPage: React.FC = () => {
    const [form] = Form.useForm<ICategoryCreate>();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const navigate = useNavigate();

    const onFinish = async (values: ICategoryCreate & { image?: UploadFile[] }) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('slug', values.slug);
            formData.append('description', values.description || '');

            if (values.image && values.image.length > 0) {
                values.image.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('image', file.originFileObj);
                    }
                });
            }

            await createCategory(formData).unwrap();
            message.success("Категорію додано успішно!");
            navigate(-1);
        } catch (error: any) {
            console.error('Помилка додавання категорії:', error);
            if (error?.data) {
                alert(`Помилка сервера: ${JSON.stringify(error.data)}`);
            } else {
                alert('Помилка при додаванні категорії');
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
            <div className="flex items-center mb-6">
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    className="mr-4 border-none shadow hover:shadow-md"
                />
                <Title level={3} className="!mb-0">Додавання категорії</Title>
            </div>

            <Form
                form={form}
                name="add-category"
                onFinish={onFinish}
                initialValues={{ name: "", slug: "", description: "" }}
                layout="vertical"
            >
                <Form.Item
                    label="Назва"
                    name="name"
                    rules={[
                        { required: true, message: "Будь ласка, введіть назву!" },
                        { whitespace: true, message: "Назва не може бути порожньою!" },
                    ]}
                >
                    <Input className="h-10 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
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
                    <Input className="h-10 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </Form.Item>

                <Form.Item label="Опис" name="description">
                    <Input.TextArea rows={4} className="rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </Form.Item>

                <ImageUploadFormItem name="image" label="Фоточка" />

                <Form.Item className="mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        className="h-11 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow hover:shadow-md transition"
                    >
                        Додати категорію
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCategoryPage;
