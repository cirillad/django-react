import React from "react";
import { Form, Input, Button, InputNumber, message, Typography } from "antd";
import { useAddProductMutation } from "../../services/apiProduct";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem";
import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;

interface IProductCreate {
    name: string;
    description: string;
    price: number;
    category: number;
    images: UploadFile[];
}

const AddProductPage: React.FC = () => {
    const [form] = Form.useForm<IProductCreate>();
    const [addProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined;

    React.useEffect(() => {
        if (categoryId) {
            form.setFieldsValue({ category: categoryId });
        }
    }, [categoryId, form]);

    const onFinish = async (values: IProductCreate & { images: UploadFile[] }) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price.toString());
            formData.append('category', (categoryId || values.category).toString());

            values.images.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });

            await addProduct(formData).unwrap();
            message.success("Продукт додано успішно!");
            navigate(-1);
        } catch (error: any) {
            console.error(error);
            message.error("Помилка при додаванні продукту");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow p-8">
            <div className="flex items-center mb-6">
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    className="mr-4 border-none shadow hover:shadow-md"
                />
                <Title level={3} className="!mb-0">Додавання продукту</Title>
            </div>

            <Form
                form={form}
                name="add-product"
                onFinish={onFinish}
                initialValues={{ name: "", description: "", price: 0, images: [] }}
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

                <ImageUploadFormItem
                    name="images"
                    label="Зображення"
                    rules={[{ required: true, message: "Додайте хоча б одне зображення!" }]}
                />

                <Form.Item className="mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        className="h-11 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow hover:shadow-md transition"
                    >
                        Додати продукт
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProductPage;
