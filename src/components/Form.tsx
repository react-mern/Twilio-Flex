import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { RuleObject } from 'rc-field-form/lib/interface';

const { Option } = Select;
const { TextArea } = Input;


interface FormValues {
  name: string;
  department: 'HR' | 'Sales';
  message: string;
}

interface MyFormProps {
  setFormValues: React.Dispatch<React.SetStateAction<FormValues | null>>;
}

const validateMessages = {
  required: '${label} is required!',
};

const MyForm: React.FC<MyFormProps> = ({ setFormValues }) => {
  const [form] = Form.useForm<FormInstance>();

  const onFinish = async (values: FormValues) => {
    setFormValues(values);
  };

  const nameRules: RuleObject[] = [
    { required: true, message: 'Please enter your name' },
    { min: 3, message: 'Name must be at least 3 characters long' },
  ];

  const departmentRules: RuleObject[] = [
    { required: true, message: 'Please select your department' },
  ];

  const messageRules: RuleObject[] = [
    { required: true, message: 'Please enter your message' },
    { min: 10, message: 'Message must be at least 10 characters long' },
  ];


  return (
    <Row justify="center">
      <Col>
        <div style={{ width: 400 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              department: 'HR', 
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={nameRules}
              style={{ textAlign: 'left' }}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              label="Department"
              name="department"
              rules={departmentRules}
              style={{ textAlign: 'left' }}
            >
              <Select placeholder="Select your department">
                <Option value="HR">HR</Option>
                <Option value="Sales">Sales</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={messageRules}
              style={{ textAlign: 'left' }}
            >
              <TextArea rows={4} placeholder="Enter your message" />
            </Form.Item>

            <Form.Item style={{ textAlign: 'left' }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default MyForm;
