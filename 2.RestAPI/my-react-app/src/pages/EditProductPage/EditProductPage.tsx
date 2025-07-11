import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, message, Typography, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../services/apiProduct";
import EditImageUploadFormItem from "../../components/ui/form/EditImageUploadFormItem";
import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;

interface IProductEdit {
    name: string;
    description: string;
    price: number;
    category: number;
    images: UploadFile[];
}

const EditProductPage: React.FC = () => {
    const [form] = Form.useForm<IProductEdit>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, error } = useGetProductByIdQuery(Number(id));
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,  // ОНОВЛЕНО: без .id
                images: product.images_data.map((imgData) => ({
                    uid: imgData.id.toString(),
                    name: imgData.image_url.split("/").pop(),
                    status: "done",
                    url: imgData.image_url,
                })),
            });
        }
    }, [product, form]);

    const onFinish = async (values: IProductEdit) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price.toString());
            formData.append('category', values.category.toString());

            values.images.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });

            await updateProduct({ id: Number(id), data: formData }).unwrap();
            message.success("Продукт оновлено успішно!");
            navigate(-1);
        } catch (error: any) {
            console.error(error);
            message.error("Помилка при оновленні продукту");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600">Помилка при завантаженні продукту</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
            <div className="flex items-center mb-6">
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    className="mr-4 border-none shadow hover:shadow-md"
                />
                <Title level={3} className="!mb-0">Редагування продукту</Title>
            </div>

            <Form
                form={form}
                name="edit-product"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Назва"
                    name="name"
                    rules={[
                        { required: true, message: "Будь ласка, введіть назву продукту!" },
                        { whitespace: true, message: "Назва не може бути порожньою!" },
                    ]}
                >
                    <Input className="h-10 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </Form.Item>

                <Form.Item
                    label="Опис"
                    name="description"
                    rules={[{ required: true, message: "Будь ласка, введіть опис продукту!" }]}
                >
                    <Input.TextArea rows={4} className="rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </Form.Item>

                <Form.Item
                    label="Ціна"
                    name="price"
                    rules={[
                        { required: true, message: "Будь ласка, введіть ціну продукту!" },
                        { type: "number", min: 0, message: "Ціна має бути додатнім числом" },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        className="rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-10"
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    style={{ display: "none" }}
                    rules={[{ required: true, message: "Вкажіть категорію продукту!" }]}
                >
                    <InputNumber />
                </Form.Item>

                <EditImageUploadFormItem
                    name="images"
                    label="Зображення"
                    rules={[{ required: true, message: "Додайте хоча б одне зображення!" }]}
                />

                <Form.Item className="mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isUpdating}
                        block
                        className="h-11 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow hover:shadow-md transition"
                    >
                        Оновити продукт
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProductPage;
