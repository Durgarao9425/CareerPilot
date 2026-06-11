import { useDispatch, useSelector } from 'react-redux';
import { addCertification, updateCertification, removeCertification, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { PlusIcon, TrashIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const CertificationsSection = () => {
  const dispatch = useDispatch();
  const { certifications } = useSelector(selectResumeData);
  const update = (id, field) => (e) => dispatch(updateCertification({ id, data: { [field]: e.target.value } }));

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <CheckBadgeIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Certifications</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={() => dispatch(addCertification())}>Add</Button>
      </div>
      {certifications.length === 0 ? (
        <div className="text-center py-8 text-surface-400 text-sm">
          <CheckBadgeIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No certifications yet</p>
          <button onClick={() => dispatch(addCertification())} className="text-primary-500 mt-1 hover:underline">+ Add certification</button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-surface-200 dark:border-surface-700 rounded-xl p-4">
              <div className="flex justify-between mb-3">
                <p className="font-medium text-sm text-surface-900 dark:text-white">{cert.name || 'New Certification'}</p>
                <button onClick={() => dispatch(removeCertification(cert.id))} className="p-1 rounded hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Certification Name" placeholder="AWS Solutions Architect" value={cert.name} onChange={update(cert.id, 'name')} />
                <Input label="Issuing Organization" placeholder="Amazon Web Services" value={cert.issuer} onChange={update(cert.id, 'issuer')} />
                <Input label="Issue Date" placeholder="Jan 2024" value={cert.date} onChange={update(cert.id, 'date')} />
                <Input label="Credential ID" placeholder="ABC-12345" value={cert.credentialId} onChange={update(cert.id, 'credentialId')} />
                <div className="sm:col-span-2">
                  <Input label="Credential URL" placeholder="https://..." value={cert.url} onChange={update(cert.id, 'url')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;
