import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Zap, Link as LinkIcon, Database } from 'lucide-react';

import OverviewTab from '@/components/auditor/OverviewTab';
import UploadCodeTab from '@/components/auditor/UploadCodeTab';
import AuditAddressTab from '@/components/auditor/AuditAddressTab';
import AuditResultsTab from '@/components/auditor/AuditResultsTab';
import PredictionTab from '@/components/auditor/PredictionTab';
import TechnologyTab from '@/components/auditor/TechnologyTab';

const AuditorPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contractCode, setContractCode] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [fileName, setFileName] = useState('');
  const [auditSource, setAuditSource] = useState('');
  const [auditResults, setAuditResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  // Removed: const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);

  const validateAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  useEffect(() => {
    setIsAddressValid(validateAddress(contractAddress));
  }, [contractAddress]);

  const generateDynamicMockResults = (source, input) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const isCodeAudit = source === 'code';
    const targetName = isCodeAudit ? (fileName || 'PastedCode.sol') : `Contract at ${input}`;

    const numVulnerabilities = Math.floor(Math.random() * 4) + 1;
    const vulnerabilities = [];
    const vulnerabilityTypes = ['Reentrancy', 'Integer Overflow', 'Timestamp Dependence', 'Gas Limit Issue', 'Access Control'];
    const severities = ['High', 'Medium', 'Low'];

    for (let i = 0; i < numVulnerabilities; i++) {
      vulnerabilities.push({
        id: `SIM-${randomSuffix}-${i}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        type: `${vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)]} in ${targetName}`,
        line: isCodeAudit ? Math.floor(Math.random() * 200) + 1 : 'N/A',
        confidence: Math.random() * (0.95 - 0.65) + 0.65,
        description: `A simulated ${vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)]} vulnerability was detected related to ${targetName}. Further investigation is recommended.`
      });
    }

    const numPredictions = Math.floor(Math.random() * 3);
    const predictedVulnerabilities = [];
    const predictionTypes = ['Oracle Manipulation', 'Flash Loan Exploitability', 'Governance Attack Surface'];
    const likelihoods = ['High', 'Medium', 'Low'];
    const impacts = ['High', 'Medium', 'Low'];

    for (let i = 0; i < numPredictions; i++) {
      predictedVulnerabilities.push({
        type: `${predictionTypes[Math.floor(Math.random() * predictionTypes.length)]} for ${targetName}`,
        likelihood: likelihoods[Math.floor(Math.random() * likelihoods.length)],
        impact: impacts[Math.floor(Math.random() * impacts.length)],
        notes: `AI predicts a potential for ${predictionTypes[Math.floor(Math.random() * predictionTypes.length)]} concerning ${targetName}. This is based on simulated pattern analysis.`
      });
    }

    return {
      fileName: targetName,
      timestamp: new Date().toISOString(),
      vulnerabilities,
      summary: `AI analysis simulation for ${targetName} found ${vulnerabilities.length} potential vulnerabilities. Overall security score simulation: ${Math.floor(Math.random() * 40) + 60}/100.`,
      recommendations: [
        `Consider comprehensive manual review for ${targetName}.`,
        `Implement robust testing strategies focusing on identified simulated issues for ${targetName}.`,
        `Follow best practices for smart contract development rigorously for ${targetName}.`
      ],
      predictedVulnerabilities
    };
  };

  // Removed: saveAuditToSupabase function

  const performAudit = useCallback(async (source, input) => {
    setIsLoading(true);
    setAuditResults(null);
    setAuditSource(source);
    const currentInput = source === 'code' ? (fileName || 'pasted code') : input;

    toast({
      title: "Audit Initiated",
      description: `Connecting to AI analysis engine for ${currentInput}...`,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      const dynamicResults = generateDynamicMockResults(source, input);

      const simulatedApiResponse = {
        success: true,
        data: dynamicResults
      };

      if (simulatedApiResponse.success && simulatedApiResponse.data) {
        setAuditResults(simulatedApiResponse.data);
        if (activeTab !== 'auditResults' && activeTab !== 'prediction') {
          setActiveTab('auditResults');
        }
        toast({
          title: "Audit Complete!",
          description: `Security audit for ${currentInput} finished. Check the results.`,
        });
        // Removed: await saveAuditToSupabase(simulatedApiResponse.data);
      } else {
        throw new Error(simulatedApiResponse.error || 'Unknown error from analysis engine simulation.');
      }

    } catch (error) {
      console.error("Audit API Error (Simulated):", error);
      setAuditResults(null);
      toast({
        title: "Audit Failed",
        description: error.message || "Could not connect to the AI analysis engine or an error occurred during processing (Simulated).",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={() => performAudit(source, input)}>
            Retry
          </Button>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }, [fileName, activeTab, contractCode, contractAddress]); // Removed saveAuditToSupabase from dependencies


  const handleAuditCode = useCallback(() => {
    if (!contractCode) {
      toast({
        title: "No Code Provided",
        description: "Please upload or paste smart contract code to audit.",
        variant: "destructive",
      });
      return;
    }
    performAudit('code', contractCode);
  }, [contractCode, performAudit]);

  const handleAuditAddress = useCallback(() => {
    if (!contractAddress) {
      toast({
        title: "No Address Provided",
        description: "Please enter a smart contract address to audit.",
        variant: "destructive",
      });
      return;
    }
    if (!isAddressValid) {
       toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum-style address.",
        variant: "destructive",
      });
      return;
    }
    performAudit('address', contractAddress);
  }, [contractAddress, isAddressValid, performAudit]);

  useEffect(() => {
    let debounceTimer;
    if (activeTab === 'auditAddress' && isAddressValid && contractAddress) {
      debounceTimer = setTimeout(() => {
        if (activeTab === 'auditAddress' && validateAddress(contractAddress)) {
            performAudit('address', contractAddress);
        }
      }, 1200);
    }
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [contractAddress, activeTab, isAddressValid, performAudit]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
            <Shield className="w-4 h-4" />
            Smart Contract Security Auditor
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
            AI-Powered Vulnerability Prediction
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leverage advanced AI to audit your smart contracts, identify vulnerabilities, and predict potential security risks before deployment.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-white/10 backdrop-blur-sm border-white/20 shadow-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Code</TabsTrigger>
            <TabsTrigger value="auditAddress">Audit Address</TabsTrigger>
            <TabsTrigger value="auditResults">Audit Results</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="overview" className="mt-8">
              <OverviewTab setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="upload" className="mt-8">
              <UploadCodeTab
                contractCode={contractCode}
                setContractCode={setContractCode}
                fileName={fileName}
                setFileName={setFileName}
                handleAudit={handleAuditCode}
                isLoading={isLoading && auditSource === 'code'}
              />
            </TabsContent>

            <TabsContent value="auditAddress" className="mt-8">
              <AuditAddressTab
                contractAddress={contractAddress}
                setContractAddress={setContractAddress}
                handleAudit={handleAuditAddress}
                isLoading={isLoading && auditSource === 'address'}
                isAddressValid={isAddressValid}
              />
            </TabsContent>

            <TabsContent value="auditResults" className="mt-8">
              <AuditResultsTab
                auditResults={auditResults}
                isLoading={isLoading}
                auditSource={auditSource}
              />
            </TabsContent>

            <TabsContent value="prediction" className="mt-8">
              <PredictionTab
                auditResults={auditResults}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="technology" className="mt-8">
              <TechnologyTab />
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Removed: isSavingToSupabase status indicator */}

      </div>
    </div>
  );
};

export default AuditorPage;
