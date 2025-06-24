import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Space, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';  // <-- імпорт типу UploadFile
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
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

    // Типізуємо fileList як масив UploadFile
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const { data: category, isLoading, error } = useGetCategoryQuery(Number(id));
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
            if (category.image) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'current_image.jpg',
                        status: 'done',
                        url: `http://127.0.0.1:4096${category.image}`,
                    },
                ]);
            }
        }
    }, [category, form]);

    const onFinish = async (values: IFormValues) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('slug', values.slug);
            if (values.description) formData.append('description', values.description);

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('image', fileList[0].originFileObj);
            }
            await updateCategory({ id: Number(id), formData }).unwrap();
            message.success('Категорію оновлено успішно!');
            navigate(-1);
        } catch (error) {
            console.error(error);
            message.error('Помилка при оновленні категорії');
        }
    };

    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
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
                >
                    Назад
                </Button>

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

                    <Form.Item label="Фото" valuePropName="fileList" getValueFromEvent={e => e && e.fileList}>
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                            fileList={fileList}
                            maxCount={1}
                            accept="image/*"
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Оновити фото</Button>
                        </Upload>
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
