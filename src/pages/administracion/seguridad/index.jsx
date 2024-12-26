import React from "react";
import { Box, Card, CardContent, Grid2 } from "@mui/material";
import SecuritySettings from "../../../components/seguridad/SecutirySettings";
import AuditLogs from "../../../components/seguridad/AuditLogs";
import TransactionLogs from "../../../components/seguridad/TransaccionLogs";
import { useGetAllLogsQuery } from "../../../services/logTransaccionesApi";
import { useGetLogsQuery } from "../../../services/auditLogsApi";
import usePaginatedData from "../../../hooks/usePaginateData";
import BackButton from "../../../components/common/BackButton";

const Seguridad = () => {
  const {
    data: transacctionsLogs,
    isLoading: isLoadingLogsTransacciones,
    paginacion: transactionPagination,
    handlePageChange: handleTransactionPageChange,
  } = usePaginatedData(useGetAllLogsQuery);

  const {
    data: auditLogsReview,
    isLoading: isLoadingAuditLogs,
    paginacion: auditPagination,
    handlePageChange: handleAuditPageChange,
  } = usePaginatedData(useGetLogsQuery);

  const securitySettings = { twoFactorEnabled: true, lockoutEnabled: false };
  const handleUpdateSettings = (field, value) => {
    console.log(`Update ${field} to ${value}`);
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <BackButton to="/admin" label="Volver al menú" />
      <Grid2 container spacing={3}>
        {/* Configuración de Seguridad */}
        <Grid2 xs={12} md={6}>
          <Card className="shadow-lg hover:shadow-xl transition rounded-lg">
            <CardContent>
              <SecuritySettings
                settings={securitySettings}
                onUpdate={handleUpdateSettings}
              />
            </CardContent>
          </Card>
        </Grid2>

        {/* Auditorías de Logs (en una sola columna a la derecha) */}
        <Grid2 xs={12} md={6}>
          <Card className="shadow-lg hover:shadow-xl transition rounded-lg mb-3">
            <CardContent>
              <AuditLogs
                logs={auditLogsReview}
                isLoading={isLoadingAuditLogs}
                onPageChange={handleAuditPageChange}
                paginacion={auditPagination}
              />
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition rounded-lg">
            <CardContent>
              <TransactionLogs
                transactions={transacctionsLogs}
                isLoading={isLoadingLogsTransacciones}
                onPageChange={handleTransactionPageChange}
                paginacion={transactionPagination}
              />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Seguridad;
