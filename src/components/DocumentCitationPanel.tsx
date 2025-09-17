import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

interface DocumentCitationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  citation: Citation | null;
  allCitations?: Citation[]; // All citations for the current document
  currentCitationIndex?: number; // Current citation index
}

export default function DocumentCitationPanel({ 
  isOpen, 
  onClose, 
  citation, 
  allCitations = [], 
  currentCitationIndex = 0 
}: DocumentCitationPanelProps) {
  const citationRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(8); // Default to page 8 which has the citation
  const [citationIndex, setCitationIndex] = useState(currentCitationIndex);

  // Auto-navigate to citation page when panel opens
  useEffect(() => {
    if (isOpen && citation) {
      setCurrentPage(citation.page);
      setCitationIndex(currentCitationIndex);
    }
  }, [isOpen, citation?.page, citation?.documentName, currentCitationIndex]);

  // Auto-scroll to highlighted citation
  useEffect(() => {
    if (isOpen && citation && citationRef.current) {
      const timer = setTimeout(() => {
        citationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, citation?.page, citation?.highlightText, currentPage]);

  // Document-specific page contents
  const getDocumentPages = () => {
    if (citation?.documentName === "IPSRA Risk Scorecard") {
      return {
        1: `EXECUTIVE SUMMARY

This IPSRA Risk Scorecard provides a comprehensive assessment of security risk factors and control effectiveness based on the Information Security Risk Assessment methodology. The scorecard evaluates multiple risk domains to provide stakeholders with actionable insights.

Key assessment areas include:
• Technical infrastructure security
• Data classification and protection
• Access control effectiveness
• Business continuity preparedness
• Compliance posture analysis

The assessment utilizes a quantitative scoring methodology to provide objective risk measurements and recommendations for improvement.`,

        2: `SCOPE AND METHODOLOGY

This risk assessment covers the organization's information security posture across all business units and technical infrastructure components. The assessment period encompasses January 2024 through March 2025.

Risk assessment methodology includes:
• Quantitative risk scoring framework
• Technical vulnerability assessments
• Policy and procedure reviews
• Control testing and validation
• Threat landscape analysis

The methodology follows industry best practices and regulatory guidelines to ensure comprehensive risk coverage.`,

        3: `TECHNICAL INFRASTRUCTURE ASSESSMENT

Technical infrastructure components were evaluated for security effectiveness and risk exposure. The assessment covered network architecture, system configurations, and security controls implementation.

Infrastructure assessment findings:
• Network segmentation adequately implemented
• Firewall rules require optimization
• Endpoint protection coverage is comprehensive
• Vulnerability management process needs enhancement
• System hardening standards are properly applied

Technical controls demonstrate moderate effectiveness with opportunities for improvement in several areas.`,

        4: `ACCESS CONTROL EVALUATION

User access management controls were reviewed to ensure appropriate permissions and prevent unauthorized access to sensitive systems and data.

Access control findings:
• Role-based access control properly implemented
• Privileged access management requires enhancement
• User access review process needs automation
• Multi-factor authentication coverage is adequate
• Identity governance framework is well-structured

Access controls demonstrate good effectiveness with some areas requiring attention to enhance security posture.`,

        5: `BUSINESS CONTINUITY PREPAREDNESS

Business continuity and disaster recovery capabilities were assessed to evaluate organizational resilience against disruptions and security incidents.

Continuity assessment findings:
• Disaster recovery plans are documented and tested
• Backup and recovery procedures are adequate
• Incident response capabilities are well-developed
• Business impact analysis requires updates
• Crisis communication plans are effective

Business continuity preparedness demonstrates strong capabilities with minor enhancements needed.`,

        6: `COMPLIANCE POSTURE ANALYSIS

Regulatory and industry compliance requirements were evaluated to assess adherence to applicable standards and frameworks.

Compliance assessment findings:
• SOC 2 Type II controls are effectively implemented
• GDPR privacy controls demonstrate strong compliance
• Industry-specific regulations are properly addressed
• Documentation and evidence collection is comprehensive
• Audit readiness is maintained at acceptable levels

Compliance posture demonstrates strong adherence to regulatory requirements.`,

        7: `THREAT LANDSCAPE ANALYSIS

Current threat landscape was analyzed to identify emerging risks and potential attack vectors affecting the organization.

Threat analysis findings:
• Ransomware threats pose moderate risk
• Phishing attacks require continued vigilance
• Supply chain risks are adequately managed
• Insider threat controls are properly implemented
• Advanced persistent threat monitoring is effective

Threat management capabilities demonstrate good effectiveness against current threat landscape.`,

        8: `VENDOR RISK MANAGEMENT

Third-party vendor security practices and risk management controls were evaluated to assess supply chain security posture.

Vendor assessment findings:
• Vendor risk assessment process is comprehensive
• Due diligence procedures are well-documented
• Contract security requirements are adequate
• Ongoing monitoring capabilities need enhancement
• Vendor incident response coordination is effective

Vendor risk management demonstrates adequate controls with opportunities for process improvement.`,

        9: `DATA PROTECTION ASSESSMENT

Data handling, classification, and protection controls were evaluated to ensure appropriate safeguarding of sensitive information.

Data protection findings:
• Data classification standards are properly implemented
• Encryption controls demonstrate strong effectiveness
• Data loss prevention capabilities are adequate
• Privacy controls meet regulatory requirements
• Data retention policies are well-defined and enforced

Data protection controls demonstrate strong effectiveness across all assessment criteria.`,

        10: `SECURITY MONITORING AND RESPONSE

Security monitoring capabilities and incident response processes were assessed to evaluate detection and response effectiveness.

Monitoring assessment findings:
• Security information and event management (SIEM) is effective
• Log collection and analysis capabilities are comprehensive
• Threat detection accuracy requires improvement
• Incident response procedures are well-documented
• Security operations center (SOC) effectiveness is good

Security monitoring demonstrates good capabilities with opportunities for enhanced threat detection.`,

        11: `RISK SCORING METHODOLOGY

The IPSRA risk scoring methodology provides quantitative assessment of security risk factors using a standardized framework for consistent evaluation.

Scoring methodology components:
• Risk factor weighting based on business impact
• Control effectiveness measurements
• Threat likelihood assessments
• Vulnerability impact analysis
• Residual risk calculations

The methodology ensures objective and repeatable risk assessments for consistent decision-making.`,

        12: `DATA CLASSIFICATION STANDARDS

The organization has implemented comprehensive data classification standards to ensure appropriate handling, storage, and protection of information based on sensitivity and criticality.

Data classification categories include:
• Public: Information that can be shared freely without restriction
• Internal: Information intended for use within the organization
• Confidential: Sensitive business information requiring protection
• Restricted: Highly sensitive information with strict access controls

Each classification level has defined handling requirements, access controls, and retention policies that are enforced through technical and administrative controls.`
      };
    } else if (citation?.documentName === "SOC2 Report 2025" || citation?.documentName === "SOC2 Security Report 2025") {
      return {
        1: `EXECUTIVE SUMMARY

This SOC 2 Security Report provides a comprehensive assessment of the organization's security controls and practices as of March 2025. The report covers the design and operating effectiveness of controls relevant to the Security, Availability, and Confidentiality trust service criteria.

Key findings include:
• Strong control environment with clear governance structure
• Effective security policies and procedures in place
• Robust technical controls for data protection
• Regular monitoring and incident response capabilities
• Areas for continued improvement and enhancement

The assessment demonstrates the organization's commitment to maintaining a secure operating environment and protecting customer data through comprehensive security controls and practices.`,

        2: `SCOPE AND METHODOLOGY

This assessment covers the period from January 1, 2024 to December 31, 2024, focusing on controls related to the organization's primary service offerings and supporting infrastructure.

Assessment methodology included:
• Interviews with key personnel across all relevant departments
• Review of policies, procedures, and documentation
• Testing of technical controls and system configurations
• Analysis of monitoring logs and incident records
• Evaluation of third-party vendor management processes

The assessment was conducted in accordance with AICPA standards and utilized a risk-based approach to evaluate control design and operating effectiveness.`,

        3: `COMPANY OVERVIEW

The organization is a leading provider of cloud-based software solutions serving enterprise customers across multiple industries. The company maintains critical infrastructure and processes sensitive customer data requiring robust security controls.

Core services include:
• Software-as-a-Service (SaaS) platform hosting
• Data processing and analytics services
• API integration services
• Technical support and maintenance

The organization employs 500+ staff members across development, operations, security, and support functions, with operations spanning multiple geographic regions and data centers.`,

        4: `RISK ASSESSMENT FRAMEWORK

The organization has implemented a comprehensive risk assessment framework that identifies, evaluates, and mitigates risks to the achievement of business objectives and regulatory compliance requirements.

Risk assessment process includes:
• Annual risk assessments with quarterly updates
• Threat modeling for critical systems and applications
• Vulnerability assessments and penetration testing
• Business impact analysis for critical processes
• Risk treatment plans with defined timelines and ownership

The risk assessment framework is integrated with the organization's broader risk management and governance processes.`,

        5: `CONTROL ENVIRONMENT

The organization maintains a strong control environment with clearly defined roles, responsibilities, and accountability structures. Senior management demonstrates commitment to integrity and ethical values throughout the organization.

Key control environment elements:
• Board of Directors oversight of risk and security matters
• Chief Information Security Officer reporting directly to CEO
• Security committee with cross-functional representation
• Regular security awareness training for all personnel
• Performance metrics and accountability measures

The control environment provides the foundation for effective implementation of security controls across the organization.`,

        6: `INFORMATION AND COMMUNICATION

Effective information and communication processes ensure that relevant security information is identified, captured, and communicated in a timely manner to enable personnel to carry out their security responsibilities.

Communication mechanisms include:
• Security policies and procedures accessible to all staff
• Regular security briefings and updates
• Incident reporting and escalation procedures
• External communication protocols for security events
• Documentation management and version control systems

Information flows support both internal decision-making and external reporting requirements.`,

        7: `SECURITY FRAMEWORK OVERVIEW

The organization has implemented a comprehensive security framework based on industry best practices and regulatory requirements. This framework encompasses multiple layers of security controls designed to protect sensitive data and ensure business continuity.

Key components of the security framework include:
• Physical security controls
• Network security architecture  
• Data classification and handling procedures
• Identity and access management
• Incident response procedures

The security framework is reviewed annually and updated as needed to address emerging threats and changing business requirements.`,

        8: `DATA ENCRYPTION STANDARDS

The organization maintains robust data protection through comprehensive encryption protocols. All sensitive data is protected using industry-standard encryption methodologies.

Data at Rest Protection:
Vendor has implemented encryption for data at rest using AES-256. All database systems, file storage, and backup media utilize this encryption standard to ensure data confidentiality. The encryption keys are managed through a centralized key management system with appropriate access controls and rotation schedules.

Audit logs indicate compliance with policy as of March 2025. Regular monitoring and testing procedures verify the effectiveness of encryption implementations across all systems.

Data in Transit Protection:
All data transmissions utilize TLS 1.3 or higher encryption protocols. Network communications between systems and external connections are secured using approved cryptographic standards.`,

        9: `ACCESS CONTROL IMPLEMENTATION

The organization has implemented comprehensive access control measures to ensure appropriate user permissions and prevent unauthorized access to sensitive systems and data.

Role-Based Access Control (RBAC):
User access rights are assigned based on job responsibilities and principle of least privilege. Regular access reviews are conducted quarterly to ensure permissions remain appropriate.

Multi-Factor Authentication:
All users accessing critical systems must utilize multi-factor authentication, including hardware tokens or mobile app-based authentication methods.

Access control measures are regularly reviewed and updated to address changing business needs and security requirements.`,

        10: `NETWORK SECURITY ARCHITECTURE

The organization maintains a robust network security architecture with multiple layers of protection including firewalls, intrusion detection systems, and network segmentation.

Network security controls include:
• Next-generation firewalls with deep packet inspection
• Network intrusion detection and prevention systems (IDS/IPS)
• Network segmentation and micro-segmentation
• Virtual private network (VPN) access for remote workers
• Regular network vulnerability assessments and penetration testing

Network security controls are continuously monitored and updated to address emerging threats.`,

        11: `INCIDENT RESPONSE PROCEDURES

A comprehensive incident response program ensures rapid detection, containment, and resolution of security incidents with appropriate communication to stakeholders.

Incident response capabilities include:
• 24/7 security operations center (SOC) monitoring
• Automated threat detection and alert systems
• Defined incident classification and escalation procedures
• Incident response team with clearly defined roles
• Post-incident review and lessons learned processes

Incident response procedures are regularly tested and updated based on lessons learned and industry best practices.`,

        12: `DATA CLASSIFICATION STANDARDS

The organization has implemented comprehensive data classification standards to ensure appropriate handling, storage, and protection of information based on sensitivity and criticality.

Data classification categories include:
• Public: Information that can be shared freely without restriction
• Internal: Information intended for use within the organization
• Confidential: Sensitive business information requiring protection
• Restricted: Highly sensitive information with strict access controls

Each classification level has defined handling requirements, access controls, and retention policies that are enforced through technical and administrative controls.`,

        13: `CONTROL TESTING RESULTS

Control testing was performed across all relevant trust service criteria to assess both design and operating effectiveness of implemented security controls.

Testing results summary:
• 98% of tested controls demonstrated effective design
• 95% of tested controls operated effectively during the assessment period
• Minor deficiencies identified in 3 control areas
• All high-risk findings have been addressed
• Management responses provided for all identified issues

Testing demonstrates strong overall control effectiveness with minor areas for improvement.`,

        14: `MANAGEMENT RESPONSES

Management has provided formal responses to all findings and recommendations identified during the assessment process.

Management commitment includes:
• Immediate remediation of identified deficiencies
• Implementation of enhanced monitoring procedures
• Additional staff training and awareness programs
• Quarterly control effectiveness reviews
• Continuous improvement initiatives

Management demonstrates strong commitment to maintaining effective security controls.`,

        15: `APPENDICES AND SUPPLEMENTAL INFORMATION

This section contains supplemental information supporting the assessment findings and recommendations.

Supplemental materials include:
• Detailed control testing procedures and results
• Policy and procedure documentation review
• Risk assessment methodology and findings
• Vendor management evaluation results
• Incident response testing documentation

These materials provide additional context and support for the assessment conclusions and recommendations.`
      };
    }
    return {};
  };

  // Get the current page content
  const getCurrentPageContent = () => {
    try {
      const documentPages = getDocumentPages();
      return documentPages[currentPage] || "Page content not available.";
    } catch (error) {
      console.warn('Error getting page content:', error);
      return "Page content unavailable.";
    }
  };

  // Document metadata for the left panel
  const getDocumentMetadata = () => {
    if (displayCitation?.documentName === "IPSRA Risk Scorecard") {
      return {
        title: "IPSRA Risk Scorecard",
        totalPages: 12,
        sections: [
          { page: 1, title: "Executive Summary" },
          { page: 2, title: "Scope and Methodology" },
          { page: 3, title: "Technical Infrastructure Assessment" },
          { page: 4, title: "Access Control Evaluation" },
          { page: 5, title: "Business Continuity Preparedness" },
          { page: 6, title: "Compliance Posture Analysis" },
          { page: 7, title: "Threat Landscape Analysis" },
          { page: 8, title: "Vendor Risk Management" },
          { page: 9, title: "Data Protection Assessment" },
          { page: 10, title: "Security Monitoring and Response" },
          { page: 11, title: "Risk Scoring Methodology" },
          { page: 12, title: "Data Classification Standards", hasCitation: true }
        ],
        lastModified: "March 2025",
        classification: "Confidential"
      };
    } else {
      return {
        title: "SOC 2 Security Report 2025",
        totalPages: 15,
        sections: [
          { page: 1, title: "Executive Summary" },
          { page: 2, title: "Scope and Methodology" },
          { page: 3, title: "Company Overview" },
          { page: 4, title: "Risk Assessment Framework" },
          { page: 5, title: "Control Environment" },
          { page: 6, title: "Information and Communication" },
          { page: 7, title: "Security Framework Overview" },
          { page: 8, title: "Data Encryption Standards", hasCitation: true },
          { page: 9, title: "Access Control Implementation" },
          { page: 10, title: "Network Security Architecture" },
          { page: 11, title: "Incident Response Procedures" },
          { page: 12, title: "Data Classification Standards" },
          { page: 13, title: "Control Testing Results" },
          { page: 14, title: "Management Responses" },
          { page: 15, title: "Appendices and Supplemental Information", hasCitation: true }
        ],
        lastModified: "March 2025",
        classification: "Confidential"
      };
    }
  };

  const documentMetadata = getDocumentMetadata();

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Citation navigation functions
  const getCurrentCitation = () => {
    if (allCitations.length > 0 && citationIndex >= 0 && citationIndex < allCitations.length) {
      return allCitations[citationIndex];
    }
    return citation;
  };

  const handlePreviousCitation = () => {
    if (citationIndex > 0 && allCitations.length > 0) {
      const newIndex = citationIndex - 1;
      setCitationIndex(newIndex);
      const prevCitation = allCitations[newIndex];
      if (prevCitation && prevCitation.page !== currentPage) {
        setCurrentPage(prevCitation.page);
      }
    }
  };

  const handleNextCitation = () => {
    if (citationIndex < allCitations.length - 1 && allCitations.length > 0) {
      const newIndex = citationIndex + 1;
      setCitationIndex(newIndex);
      const nextCitation = allCitations[newIndex];
      if (nextCitation && nextCitation.page !== currentPage) {
        setCurrentPage(nextCitation.page);
      }
    }
  };

  const hasMultipleCitations = allCitations.length > 1;
  const displayCitation = getCurrentCitation();

  const getHighlightedContent = (content: string, highlightText: string) => {
    if (!highlightText || currentPage !== displayCitation?.page || !content) return content;
    
    try {
      // Escape special regex characters to prevent regex errors
      const escapedHighlight = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\  const getHighlightedContent = (content: string, highlightText: string) => {
    if (!highlightText || currentPage !== displayCitation?.page) return content;
    
    const parts = content.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightText.toLowerCase() ? 
        <mark 
          key={index} 
          ref={citationRef}
          className="bg-yellow-200 px-2 py-1 rounded font-medium border border-yellow-300"
        >
          {part}
        </mark> : 
        part
    );
  };');
      const parts = content.split(new RegExp(`(${escapedHighlight})`, 'gi'));
      
      return parts.map((part, index) => {
        if (part.toLowerCase() === highlightText.toLowerCase()) {
          return (
            <mark 
              key={`highlight-${index}`}
              ref={index === 0 ? citationRef : null} // Only set ref on first occurrence
              className="bg-yellow-200 px-2 py-1 rounded font-medium border border-yellow-300"
            >
              {part}
            </mark>
          );
        }
        return part;
      });
    } catch (error) {
      console.warn('Error highlighting content:', error);
      return content;
    }
  };

  if (!citation && !displayCitation) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[1200px] max-w-[95vw] p-0 gap-0 sm:max-w-[95vw] overflow-hidden mt-20">
        <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
          <div>
            <SheetTitle className="text-lg">Document Citation</SheetTitle>
            <SheetDescription className="text-sm text-gray-600 mt-1">
              View the source document and highlighted citation text
            </SheetDescription>
          </div>
        </SheetHeader>
        
        <div className="flex h-[calc(100vh-120px)] overflow-hidden max-w-full">
          {/* Left Panel - Document Information */}
          <div className="w-72 border-r bg-gray-50 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="p-4 border-b bg-white flex-shrink-0">
              <h3 className="text-sm font-medium">Document Information</h3>
              <p className="text-xs text-gray-600 mt-1">{displayCitation?.documentName}</p>
            </div>
            
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-4 space-y-4">
                {/* Document Details */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Document Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Pages:</span>
                        <span>{documentMetadata.totalPages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Modified:</span>
                        <span>{documentMetadata.lastModified}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Classification:</span>
                        <span className="text-red-600 font-medium">{documentMetadata.classification}</span>
                      </div>
                    </div>
                  </div>

                  {/* Citation Info */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Citation Details</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Found on Page:</span>
                          <span className="font-medium">{displayCitation?.page}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paragraph:</span>
                          <span className="font-medium">{displayCitation?.paragraph}</span>
                        </div>
                        {hasMultipleCitations && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Citation:</span>
                            <span className="font-medium">{citationIndex + 1} of {allCitations.length}</span>
                          </div>
                        )}
                        <div className="mt-2 pt-2 border-t border-yellow-200">
                          <span className="text-xs text-yellow-700 font-medium">📍 Citation highlighted in document</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table of Contents */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Table of Contents</h4>
                    <div className="space-y-1">
                      {documentMetadata.sections.map((section) => (
                        <div
                          key={section.page}
                          onClick={() => handlePageClick(section.page)}
                          className={`p-2 rounded text-sm cursor-pointer transition-colors hover:bg-gray-100 ${
                            currentPage === section.page && section.page === displayCitation?.page
                              ? 'bg-yellow-50 border border-yellow-300 ring-1 ring-yellow-400'
                              : currentPage === section.page
                              ? 'bg-blue-50 border border-blue-200 ring-1 ring-blue-300'
                              : section.hasCitation
                              ? 'bg-gray-50 border border-gray-300'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="font-medium">Page {section.page}</div>
                          <div className="text-xs text-gray-600 mt-1">{section.title}</div>
                          {section.page === displayCitation?.page && currentPage === section.page && (
                            <div className="text-xs text-yellow-700 mt-1 font-medium">📍 Citation highlighted below</div>
                          )}
                          {section.hasCitation && section.page !== displayCitation?.page && (
                            <div className="text-xs text-gray-600 mt-1 font-medium">📄 Contains citation</div>
                          )}
                          {currentPage === section.page && section.page !== displayCitation?.page && (
                            <div className="text-xs text-blue-700 mt-1 font-medium">👁 Currently viewing</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Single Page Display */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Document Header */}
            <div className="px-6 py-3 border-b bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">{displayCitation?.documentName}</h4>
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {documentMetadata.totalPages} • {documentMetadata.sections.find(s => s.page === currentPage)?.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {hasMultipleCitations && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Citation {citationIndex + 1} of {allCitations.length}
                    </div>
                  )}
                  {currentPage === displayCitation?.page && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Citation highlighted below
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Single Page Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="mb-4 pb-4 border-b">
                      <h2 className="text-lg font-medium text-gray-900">
                        Page {currentPage}: {documentMetadata.sections.find(s => s.page === currentPage)?.title}
                      </h2>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm break-words word-wrap max-w-full">
                      {getHighlightedContent(getCurrentPageContent(), displayCitation?.highlightText || '')}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Citation Navigation - Bottom Section */}
            {hasMultipleCitations && (
              <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Citation {citationIndex + 1} of {allCitations.length} in this document
                    </div>
                    {displayCitation?.page && (
                      <div className="text-sm text-gray-500">
                        Page {displayCitation.page}, Paragraph {displayCitation.paragraph}  
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousCitation}
                      disabled={citationIndex === 0}
                      className="text-xs"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous Citation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextCitation}
                      disabled={citationIndex === allCitations.length - 1}
                      className="text-xs"
                    >
                      Next Citation
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}