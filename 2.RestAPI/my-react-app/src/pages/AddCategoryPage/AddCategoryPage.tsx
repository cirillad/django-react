import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Space, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateCategoryMutation } from '../../services/apiCategory';
import { useNavigate } from 'react-router-dom';

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

    // Типізуємо fileList як масив UploadFile
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFinish = async (values: IFormValues) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('slug', values.slug);
            if (values.description) formData.append('description', values.description);

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as Blob);
            }

            await createCategory(formData).unwrap();
            message.success('Категорію додано успішно!');
            form.resetFields();
            setFileList([]);
            navigate(-1);
        } catch (error) {
            console.error(error);
            message.error('Помилка при додаванні категорії');
        }
    };

    // Типізуємо параметр як об'єкт з fileList масиву UploadFile
    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                    onClick={() => navigate(-1)}
                    type="default"
                    style={{ width: 80 }}
                    aria-label="Назад"
                >
                    Назад
                </Button>

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

                    <Form.Item label="Фото" valuePropName="fileList" getValueFromEvent={e => e && e.fileList}>
                        <Upload
                            beforeUpload={() => false} // щоб не завантажувати автоматично
                            onChange={handleUploadChange}
                            fileList={fileList}
                            maxCount={1}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Обрати фото</Button>
                        </Upload>
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
