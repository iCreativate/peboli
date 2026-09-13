import { AiResellerStudio } from '@/components/ai-reseller/AiResellerStudio';

export const metadata = {
  title: 'AI Reseller Studio | Admin',
};

export default function AdminAiStudioPage() {
  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <AiResellerStudio />
    </div>
  );
}
