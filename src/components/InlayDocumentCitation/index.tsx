import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { FileText, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { DEFAULT_CITATION_PAGE } from "./constants";
import { Citation, InlayDocumentCitationProps } from "./types";

export default function InlayDocumentCitation({ citation, onClose, searchQuery = "", onMapToTextArea }: InlayDocumentCitationProps) {
  const citationRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(DEFAULT_CITATION_PAGE);
  const [selectedText, setSelectedText] = useState("");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [searchResults, setSearchResults] = useState<{page: number, matchCount: number}[]>([]);
  const [currentSearchMatch, setCurrentSearchMatch] = useState(0);
  const [totalSearchMatches, setTotalSearchMatches] = useState(0);

  useEffect(() => {
    if (citation) {
      setCurrentPage(citation.page);
    }
  }, [citation]);

  useEffect(() => {
    if (citation && citationRef.current) {
      setTimeout(() => {
        citationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [citation, currentPage]);

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      console.log('Search query changed to:', searchQuery);
      performDocumentSearch(searchQuery);
    } else {
      setSearchResults([]);
      setCurrentSearchMatch(0);
      setTotalSearchMatches(0);
    }
  }, [searchQuery, citation]);

  const performDocumentSearch = (query: string) => {
    if (!citation || !query.trim()) {
      setSearchResults([]);
      setCurrentSearchMatch(0);
      setTotalSearchMatches(0);
      return;
    }

    const documentPages = getDocumentPages();
    const results: {page: number, matchCount: number}[] = [];
    let totalMatches = 0;

    Object.entries(documentPages).forEach(([pageNum, content]) => {
      const pageNumber = parseInt(pageNum);
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedQuery, 'gi');
      const matches = content.match(searchRegex);
      
      if (matches && matches.length > 0) {
        results.push({ page: pageNumber, matchCount: matches.length });
        totalMatches += matches.length;
      }
    });

    setSearchResults(results);
    setTotalSearchMatches(totalMatches);
    setCurrentSearchMatch(1);

    if (results.length > 0 && !results.find(r => r.page === currentPage)) {
      setCurrentPage(results[0].page);
    }
  };

  const goToNextSearchResult = () => {
    if (searchResults.length === 0) return;
    
    const currentPageResults = searchResults.find(r => r.page === currentPage);
    if (currentPageResults) {
      if (currentSearchMatch < getTotalMatchesUpToPage(currentPage)) {
        setCurrentSearchMatch(currentSearchMatch + 1);
        return;
      }
    }
    
    const currentResultIndex = searchResults.findIndex(r => r.page === currentPage);
    const nextResultIndex = (currentResultIndex + 1) % searchResults.length;
    const nextPage = searchResults[nextResultIndex].page;
    
    setCurrentPage(nextPage);
    setCurrentSearchMatch(getTotalMatchesUpToPage(nextPage - 1) + 1);
  };

  const goToPreviousSearchResult = () => {
    if (searchResults.length === 0) return;
    
    if (currentSearchMatch > getTotalMatchesUpToPage(currentPage - 1) + 1) {
      setCurrentSearchMatch(currentSearchMatch - 1);
      return;
    }
    
    const currentResultIndex = searchResults.findIndex(r => r.page === currentPage);
    const prevResultIndex = currentResultIndex === 0 ? searchResults.length - 1 : currentResultIndex - 1;
    const prevPage = searchResults[prevResultIndex].page;
    
    setCurrentPage(prevPage);
    const prevPageResults = searchResults.find(r => r.page === prevPage);
    setCurrentSearchMatch(getTotalMatchesUpToPage(prevPage));
  };

  const getTotalMatchesUpToPage = (page: number) => {
    return searchResults
      .filter(r => r.page <= page)
      .reduce((total, r) => total + r.matchCount, 0);
  };

  const handleTextSelection = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
    } else {
      setContextMenuVisible(false);
      setSelectedText("");
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      
      const menuWidth = 150;
      const menuHeight = 40;
      let x = event.clientX;
      let y = event.clientY;
      
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (y + menuHeight > window.innerHeight) {
        y = event.clientY - menuHeight;
      }
      
      setContextMenuPosition({ x, y });
      setContextMenuVisible(true);
    }
  };

  const handleMapToTextArea = () => {
    if (selectedText && onMapToTextArea) {
      onMapToTextArea(selectedText);
      setContextMenuVisible(false);
      setSelectedText("");
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setContextMenuVisible(false);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenuVisible(false);
      }
    };

    if (contextMenuVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [contextMenuVisible]);

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
    return {} as Record<number, string>;
  };

  const getCurrentPageContent = () => {
    const documentPages = getDocumentPages();
    return documentPages[currentPage] || "Page content not available.";
  };

  const getTotalPages = () => {
    const documentPages = getDocumentPages();
    return Object.keys(documentPages).length;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getHighlightedContent = (content: string, highlightText: string) => {
    console.log('Search query received:', searchQuery);
    
    const parts: Array<{ text: string; type: 'normal' | 'citation' | 'search'; ref?: React.RefObject<HTMLElement> } | {text: string; type: 'normal'}> = [];
    let remainingContent = content;
    
    if (highlightText && currentPage === citation?.page) {
      const escapedHighlight = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedHighlight})`, 'gi');
      const matches = [...remainingContent.matchAll(regex)];
      
      if (matches.length > 0) {
        let lastIndex = 0;
        matches.forEach((match, index) => {
          if (match.index! > lastIndex) {
            parts.push({
              text: remainingContent.substring(lastIndex, match.index),
              type: 'normal'
            });
          }
          
          parts.push({
            text: match[0],
            type: 'citation',
            ref: index === 0 ? citationRef : undefined
          });
          
          lastIndex = match.index! + match[0].length;
        });
        
        if (lastIndex < remainingContent.length) {
          parts.push({
            text: remainingContent.substring(lastIndex),
            type: 'normal'
          });
        }
      } else {
        parts.push({ text: remainingContent, type: 'normal' });
      }
    } else {
      parts.push({ text: remainingContent, type: 'normal' });
    }
    
    if (searchQuery && searchQuery.trim()) {
      console.log('Processing search highlighting for:', searchQuery);
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');
      
      const newParts: Array<{ text: string; type: 'normal' | 'citation' | 'search'; ref?: React.RefObject<HTMLElement> } | {text: string; type: 'normal'}> = [];
      parts.forEach(part => {
        if ((part as any).type === 'citation') {
          newParts.push(part as any);
        } else {
          const searchMatches = [...(part as any).text.matchAll(searchRegex)];
          if (searchMatches.length > 0) {
            console.log('Found search matches:', searchMatches.length);
            let lastIndex = 0;
            searchMatches.forEach(match => {
              if (match.index! > lastIndex) {
                newParts.push({
                  text: (part as any).text.substring(lastIndex, match.index),
                  type: 'normal'
                });
              }
              
              newParts.push({
                text: match[0],
                type: 'search'
              });
              
              lastIndex = match.index! + match[0].length;
            });
            
            if (lastIndex < (part as any).text.length) {
              newParts.push({
                text: (part as any).text.substring(lastIndex),
                type: 'normal'
              });
            }
          } else {
            newParts.push(part as any);
          }
        }
      });
      
      return newParts.map((part, index) => {
        if ((part as any).type === 'citation') {
          return (
            <mark 
              key={index}
              ref={(part as any).ref}
              className="bg-yellow-200 px-2 py-1 rounded font-medium border border-yellow-300"
            >
              {(part as any).text}
            </mark>
          );
        } else if ((part as any).type === 'search') {
          return (
            <mark 
              key={index}
              className="bg-blue-200 px-1 py-0.5 rounded font-medium border border-blue-300"
            >
              {(part as any).text}
            </mark>
          );
        } else {
          return (part as any).text;
        }
      });
    }
    
    return parts.map((part, index) => {
      if ((part as any).type === 'citation') {
        return (
          <mark 
            key={index}
            ref={(part as any).ref}
            className="bg-yellow-200 px-2 py-1 rounded font-medium border border-yellow-300"
          >
            {(part as any).text}
          </mark>
        );
      } else {
        return (part as any).text;
      }
    });
  };

  if (!citation) return null;

  const totalPages = getTotalPages();

  return (
    <div className="flex h-full overflow-hidden flex-col bg-white min-h-0 max-h-full">
      <div className="bg-white border-b p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <div>
            <h2 className="text-sm font-medium text-gray-900">{citation.documentName}</h2>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>
                Page {currentPage}
                {currentPage === citation.page && `, Paragraph ${citation.paragraph}`}
              </span>
              {currentPage === citation.page && (
                <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border">Citation</span>
              )}
            </div>
          </div>
        </div>
        
        {searchQuery && totalSearchMatches > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="font-medium">
              {currentSearchMatch} of {totalSearchMatches} results
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousSearchResult}
                disabled={totalSearchMatches <= 1}
                className="h-6 w-6 p-0 hover:bg-gray-100"
                title="Previous result"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextSearchResult}
                disabled={totalSearchMatches <= 1}
                className="h-6 w-6 p-0 hover:bg-gray-100"
                title="Next result"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden bg-white">
        <ScrollArea className="h-full">
          <div className="p-4 bg-white min-h-full">
            <div 
              className="prose max-w-none text-sm leading-relaxed text-gray-800 whitespace-pre-wrap select-text cursor-text [&::selection]:bg-blue-200 [&::selection]:text-blue-900"
              onMouseUp={handleTextSelection}
              onContextMenu={handleContextMenu}
            >
              {getHighlightedContent(getCurrentPageContent(), citation.highlightText)}
            </div>
          </div>
        </ScrollArea>
      </div>

      {totalPages > 1 && (
        <div className="bg-white border-t p-3 flex items-center justify-between flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {contextMenuVisible && (
        <div
          className="fixed bg-white border border-gray-300 rounded-md shadow-xl z-[9999] py-1 min-w-[140px]"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleMapToTextArea}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-150"
          >
            Add to AI
          </button>
        </div>
      )}
    </div>
  );
}
