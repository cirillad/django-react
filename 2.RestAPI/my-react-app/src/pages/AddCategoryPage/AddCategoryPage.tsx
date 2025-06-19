import React from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { useCreateCategoryMutation } from '../../services/apiCategory';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

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

const AddCategoryPage: React.FC = () => {
    const [form] = Form.useForm();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const navigate = useNavigate();

    const onFinish = async (values: IFormValues) => {
        try {
            await createCategory(values).unwrap();
            message.success('Категорію додано успішно!');
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error('Помилка при додаванні категорії');
        }
    };

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
                    Додавання категорії
                </Title>

                <Form
                    {...layout}
                    form={form}
                    name="add-category"
                    onFinish={onFinish}
                    initialValues={{ name: '', slug: '', description: '' }}
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
