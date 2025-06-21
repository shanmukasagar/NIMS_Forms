// /pages/hod/approval.js (in Next.js)
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HODApprovalPage() {
    const router = useRouter();
    const { token, tableName } = router.query;
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        if (token && tableName) {
        axiosInstance.post('/api/investigator/hod-approve', { token, tableName })
            .then(() => setMessage("HOD Approval successful."))
            .catch(() => setMessage("Invalid or expired token."));
        }
    }, [token, tableName]);

    return (
        <div style={{ padding: '40px' }}>
        <h2>{message}</h2>
        </div>
    );
}
