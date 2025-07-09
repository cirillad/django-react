import React from "react";
import { Upload, Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, CloseCircleFilled } from "@ant-design/icons";
import { ReactSortable } from "react-sortablejs";

interface Props {
    name: string;
    label: string;
    maxCount?: number;
    rules?: any[];
}

const ImageUploadFormItem: React.FC<Props> = ({ name, label, maxCount = 5, rules }) => {
    return (
        <Form.Item noStyle shouldUpdate>
            {({ getFieldValue, setFieldsValue }) => {
                const value: UploadFile[] = getFieldValue(name) || [];

                const handleChange = (fileList: UploadFile[]) => {
                    setFieldsValue({ [name]: fileList });
                };

                const handleDelete = (uid: string) => {
                    handleChange(value.filter(file => file.uid !== uid));
                };

                return (
                    <Form.Item
                        name={name}
                        label={label}
                        rules={rules}
                    >
                        {/* Upload для додавання нових */}
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                            maxCount={maxCount}
                            fileList={[]}
                            onChange={({ fileList }) =>
                                handleChange([...value, ...fileList])
                            }
                        >
                            {value.length >= maxCount ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Завантажити</div>
                                </div>
                            )}
                        </Upload>

                        {/* ReactSortable для рендера та сортування існуючих */}
                        <ReactSortable
                            list={value}
                            setList={handleChange}
                            className="flex flex-wrap gap-4 mt-4"
                        >
                            {value.map((file) => (
                                <div
                                    key={file.uid}
                                    className="relative w-28 h-28 rounded overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-move group"
                                >
                                    <img
                                        src={
                                            file.thumbUrl ||
                                            URL.createObjectURL(file.originFileObj as Blob)
                                        }
                                        alt={file.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(file.uid)}
                                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-0.5 text-red-600 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <CloseCircleFilled className="text-lg" />
                                    </button>
                                </div>
                            ))}
                        </ReactSortable>
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};

export default ImageUploadFormItem;
