import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addCertification, updateCertification, removeCertification, selectResumeData } from '@features/resume/resumeSlice';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { PlusIcon, TrashIcon, CheckBadgeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CertificationsSection = () => {
  const dispatch = useDispatch();
  const { certifications } = useSelector(selectResumeData);

  // Modal and editing states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form local state
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: '',
    url: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      url: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingItem(cert);
    setForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credentialId: cert.credentialId || '',
      url: cert.url || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const itemData = {
      name: form.name,
      issuer: form.issuer,
      date: form.date,
      credentialId: form.credentialId,
      url: form.url,
    };

    if (editingItem) {
      dispatch(updateCertification({ id: editingItem.id, data: itemData }));
    } else {
      const newId = uuidv4();
      dispatch(addCertification()); // inserts empty
      dispatch(updateCertification({ id: certifications[certifications.length - 1]?.id || newId, data: itemData }));
    }
    setModalOpen(false);
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <CheckBadgeIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-white font-display">Certifications</h3>
        </div>
        <Button size="sm" icon={PlusIcon} onClick={handleOpenAdd}>Add</Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-surface-400 text-sm">
          <CheckBadgeIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No certifications yet</p>
          <button onClick={handleOpenAdd} className="text-primary-500 mt-1 hover:underline">+ Add certification</button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {cert.name || 'New Certification'}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {cert.issuer || ''} {cert.date ? `| ${cert.date}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(removeCertification(cert.id))}
                    className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/30 text-danger-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Certification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Update an existing certification" : "Create a new certification"}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Certification Name"
              placeholder="AWS Certified Solutions Architect"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              label="Issuing Organization"
              placeholder="Amazon Web Services"
              value={form.issuer}
              onChange={(e) => setForm(prev => ({ ...prev, issuer: e.target.value }))}
            />
            <Input
              label="Issue Date"
              placeholder="Jan 2024"
              value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
            />
            <Input
              label="Credential ID"
              placeholder="AWS-SAR-12345"
              value={form.credentialId}
              onChange={(e) => setForm(prev => ({ ...prev, credentialId: e.target.value }))}
            />
          </div>

          <Input
            label="Credential URL"
            placeholder="https://credly.com/..."
            value={form.url}
            onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-800 dark:text-surface-450 dark:hover:text-surface-200"
            >
              Cancel
            </button>
            <Button onClick={handleSave}>
              {editingItem ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CertificationsSection;
