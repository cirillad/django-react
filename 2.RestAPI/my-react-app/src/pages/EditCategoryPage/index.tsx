import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
    useGetCategoryQuery,
    useUpdateCategoryMutation,
} from "../../services/apiCategory";

const { Title } = Typography;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
};

interface IFormValues {
    name: string;
    slug: string;
    description?: string;
}

const EditCategoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { data: category, isLoading, error } = useGetCategoryQuery(Number(id));
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
            });
        }
    }, [category, form]);

    const onFinish = async (values: IFormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name.trim());
            formData.append("slug", values.slug.trim());
            formData.append("description", values.description?.trim() || "");
            if (imageFile) {
                formData.append("image", imageFile);
            }

            await updateCategory({ id: Number(id), formData }).unwrap();
            message.success("Категорію оновлено успішно!");
            navigate(-1);
        } catch (error) {
            console.error(error);
            message.error("Помилка при оновленні категорії");
        }
    };

    const handleUploadChange = (info: any) => {
        if (info.file.originFileObj) {
            setImageFile(info.file.originFileObj);
            console.log("Вибрано файл:", info.file.originFileObj);
        }
    };

    if (isLoading) return <div>Завантаження категорії...</div>;
    if (error) return <div>Помилка при завантаженні категорії</div>;

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
                    Редагування категорії
                </Title>

                <Form
                    {...layout}
                    form={form}
                    name="edit-category"
                    onFinish={onFinish}
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

                    <Form.Item label="Поточне зображення">
                        {category?.image ? (
                            <img
                                src={category.image}
                                alt="Поточне зображення"
                                style={{ width: "100%", borderRadius: 8 }}
                            />
                        ) : (
                            <div>Зображення відсутнє</div>
                        )}
                    </Form.Item>

                    <Form.Item label="Нове зображення">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    console.log("Вибрано файл:", file);
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={isUpdating} block>
                            Оновити категорію
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    );
};

export default EditCategoryPage;