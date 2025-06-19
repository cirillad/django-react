import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetCategoryQuery, useUpdateCategoryMutation } from '../../services/apiCategory';

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

    // Отримати дані категорії
    const { data: category, isLoading, error } = useGetCategoryQuery(Number(id));
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
        }
    }, [category, form]);

    const onFinish = async (values: IFormValues) => {
        try {
            await updateCategory({ id: Number(id), ...values }).unwrap();
            message.success('Категорію оновлено успішно!');
            navigate(-1);
        } catch (error) {
            console.error(error);
            message.error('Помилка при оновленні категорії');
        }
    };

    if (isLoading) return <div>Завантаження категорії...</div>;
    if (error) return <div>Помилка при завантаженні категорії</div>;

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    style={{ width: 80 }}
                    aria-label="Назад"
                />

                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Редагування категорії
                </Title>

                <Form
                    {...layout}
                    form={form}
                    name="edit-category"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Назва"
                        name="name"
                        rules={[{ required: true, message: 'Будь ласка, введіть назву!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Слаг"
                        name="slug"
                        rules={[{ required: true, message: 'Будь ласка, введіть слаг!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Опис" name="description">
                        <Input.TextArea rows={4} />
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
