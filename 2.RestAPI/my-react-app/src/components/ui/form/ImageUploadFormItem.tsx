import React, { useRef } from "react";
import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, CloseCircleFilled } from "@ant-design/icons";
import { ReactSortable } from "react-sortablejs";

interface Props {
    name: string;
    label: string;
    maxCount?: number;
    rules?: any[];
}

type UploadFileWithId = UploadFile & { id: string };

const ImageUploadFormItem: React.FC<Props> = ({ name, label, maxCount = 5, rules }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Form.Item noStyle shouldUpdate>
            {({ getFieldValue, setFieldsValue }) => {
                const rawValue: UploadFile[] = getFieldValue(name) || [];
                const value: UploadFileWithId[] = rawValue.map(file => ({
                    ...file,
                    id: file.uid,
                }));

                const handleChange = (fileList: UploadFileWithId[]) => {
                    const cleaned = fileList.map(({ id, ...rest }) => rest);
                    setFieldsValue({ [name]: cleaned });
                };

                const handleDelete = (uid: string) => {
                    handleChange(value.filter(file => file.uid !== uid));
                };

                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (!files) return;

                    const newFiles: UploadFileWithId[] = Array.from(files).map(file => ({
                        uid: file.uid || file.name + Date.now(),
                        name: file.name,
                        status: "done",
                        originFileObj: file,
                        id: file.uid || file.name + Date.now(),
                        thumbUrl: URL.createObjectURL(file),
                    }));

                    handleChange([...value, ...newFiles]);

                    // Очищуємо input, щоб можна було завантажити той самий файл ще раз
                    e.target.value = "";
                };

                const handleClickUpload = () => {
                    inputRef.current?.click();
                };

                return (
                    <Form.Item
                        name={name}
                        label={label}
                        rules={rules}
                    >
                        {/* Прихований input type="file" */}
                        <input
                            type="file"
                            ref={inputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            multiple
                            onChange={handleInputChange}
                        />

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

                            {value.length < maxCount && (
                                <div
                                    onClick={handleClickUpload}
                                    className="flex flex-col items-center justify-center w-28 h-28 border border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition"
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Завантажити</div>
                                </div>
                            )}
                        </ReactSortable>
                    </Form.Item>
                );
            }}
        </Form.Item>
    );
};

export default ImageUploadFormItem;
