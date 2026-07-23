import { useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from '@arco-design/web-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { WorkItemActions, WorkItemType } from '../types';
import { TYPE_LABEL_MAP, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from '../constants';
import { initialEmployees } from '../../employee/mockData';

const FormItem = Form.Item;

interface WorkItemFormModalProps {
  type: WorkItemType;
  projectId: string;
  workItems: WorkItemActions;
  onClose: () => void;
}

export function WorkItemFormModal({ type, projectId, workItems, onClose }: WorkItemFormModalProps) {
  const [form] = Form.useForm();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const baseData = {
        projectId,
        title: values.title,
        description,
        priority: values.priority,
        assigneeId: values.assigneeId,
        creatorId: '1',  // 当前用户
        contractId: values.contractId,
      };

      if (type === 'requirement') {
        workItems.createRequirement({
          ...baseData,
          acceptanceCriteria: values.acceptanceCriteria,
        });
      } else if (type === 'task') {
        workItems.createTask({
          ...baseData,
          requirementId: values.requirementId,
          estimatedHours: values.estimatedHours,
          actualHours: 0,
          checklist: [],
          dueDate: values.dueDate,
        });
      } else {
        workItems.createDefect({
          ...baseData,
          severity: values.severity,
          requirementId: values.requirementId,
          taskId: values.taskId,
          reproductionSteps: values.reproductionSteps,
          dueDate: values.dueDate,
        });
      }

      onClose();
    } catch (err) {
      // 表单校验失败
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`新建${TYPE_LABEL_MAP[type]}`}
      visible={true}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={submitting}
      style={{ width: 640 }}
    >
      <Form form={form} layout="vertical">
        <FormItem
          label="标题"
          field="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" maxLength={100} showWordLimit />
        </FormItem>

        <FormItem
          label="描述"
          field="description"
        >
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ height: 180, marginBottom: 40 }}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
          />
        </FormItem>

        <Space style={{ width: '100%' }}>
          <FormItem
            label="优先级"
            field="priority"
            rules={[{ required: true, message: '请选择优先级' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="请选择">
              {PRIORITY_OPTIONS.map(p => (
                <Select.Option key={p} value={p}>{p}</Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="负责人"
            field="assigneeId"
            rules={[{ required: true, message: '请选择负责人' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="请选择" showSearch>
              {initialEmployees.map(emp => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position})
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Space>

        {/* 需求特有字段 */}
        {type === 'requirement' && (
          <FormItem label="验收标准" field="acceptanceCriteria">
            <Input.TextArea placeholder="请输入验收标准" autoSize={{ minRows: 3, maxRows: 6 }} />
          </FormItem>
        )}

        {/* 任务特有字段 */}
        {type === 'task' && (
          <Space style={{ width: '100%' }}>
            <FormItem label="预计工时(h)" field="estimatedHours" style={{ flex: 1 }}>
              <InputNumber min={0} max={999} placeholder="0" />
            </FormItem>
            <FormItem label="截止日期" field="dueDate" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </FormItem>
          </Space>
        )}

        {/* 缺陷特有字段 */}
        {type === 'defect' && (
          <>
            <FormItem
              label="严重程度"
              field="severity"
              rules={[{ required: true, message: '请选择严重程度' }]}
            >
              <Select placeholder="请选择">
                {SEVERITY_OPTIONS.map(s => (
                  <Select.Option key={s} value={s}>{s}</Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label="复现步骤" field="reproductionSteps">
              <Input.TextArea placeholder="请输入复现步骤" autoSize={{ minRows: 3, maxRows: 6 }} />
            </FormItem>
            <FormItem label="截止日期" field="dueDate">
              <DatePicker style={{ width: '100%' }} />
            </FormItem>
          </>
        )}

        {/* 关联合同 */}
        <FormItem label="关联合同" field="contractId">
          <Input placeholder="请输入合同编号（可选）" />
        </FormItem>
      </Form>
    </Modal>
  );
}
