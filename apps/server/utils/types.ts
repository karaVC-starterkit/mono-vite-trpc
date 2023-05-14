export interface IUser {
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
}
interface AttachmentType {
  content: string;
  filename: string;
}
export interface IMailSendParams {
  to: string;
  subject: string;
  //   templates?: TemplateConfigType;
  data: Record<string, any>;
  attachments?: AttachmentType[];
}
