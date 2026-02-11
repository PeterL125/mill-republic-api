// src/components/TrackingResult.jsx
import React, { useState, useEffect } from 'react';

// ---------- 多语言翻译字典 ----------
const translations = {
  en: {
    trackingId: 'Tracking ID',
    status: 'Status',
    delivered: 'Delivered',
    inTransit: 'In Transit',
    from: 'From',
    to: 'To',
    address: 'Address',
    estimatedDelivery: 'Estimated Delivery',
    lastUpdate: 'Last Update',
    farmToFork: 'Farm to Fork Countdown',
    timeline: 'Tracking History',
    pickupFromFarm: 'Pickup from farm',
    processedAtHub: 'Processed at MR Hub',
    dispatchedFromHub: 'Dispatched from MR Hub',
    arrivalAtWarehouse: 'Arrival at warehouse',
    deliveredEvent: 'Delivered',
    showFullDetails: 'Show full details',
    hideFullDetails: 'Hide full details',
    qualityAnalysis: 'Quality Analysis',
    batchId: 'Batch ID',
    ashContent: 'Ash Content',
    proteinContent: 'Protein Content at Farm',
    moistureContent: 'Moisture Content at Farm',
    zeleny: 'Zeleny Sedimentation',
    fallingNumber: 'Falling Number',
    avgStorageTemp: 'Avg. Storage Temperature',
    avgStorageMoisture: 'Avg. Storage Moisture',
    smartExtraction: 'Smart Extraction',
    photoOfCargo: 'Photo of Cargo',
    customerSignature: 'Customer Signature',
    personnel: 'Personnel',
    pickupPerson: 'Pickup Person',
    processPerson: 'Process Person',
    deliveryPerson: 'Delivery Person',
    notProvided: '—',
    noResults: 'No tracking record found for this ID',
    searchPlaceholder: 'Enter Tracking ID',
  },
  nl: {
    trackingId: 'Trackingnummer',
    status: 'Status',
    delivered: 'Afgeleverd',
    inTransit: 'Onderweg',
    from: 'Van',
    to: 'Naar',
    address: 'Adres',
    estimatedDelivery: 'Verwachte levering',
    lastUpdate: 'Laatste update',
    farmToFork: 'Countdown van boer tot bord',
    timeline: 'Tijdlijn',
    pickupFromFarm: 'Opgehaald bij boerderij',
    processedAtHub: 'Verwerkt bij MR Hub',
    dispatchedFromHub: 'Verzonden vanuit MR Hub',
    arrivalAtWarehouse: 'Aangekomen in magazijn',
    deliveredEvent: 'Afgeleverd',
    showFullDetails: 'Toon alle details',
    hideFullDetails: 'Verberg details',
    qualityAnalysis: 'Kwaliteitsanalyse',
    batchId: 'Batchnummer',
    ashContent: 'Asgehalte',
    proteinContent: 'Eiwitgehalte',
    moistureContent: 'Vochtgehalte',
    zeleny: 'Zeleny-sedimentatie',
    fallingNumber: 'Valgetal',
    avgStorageTemp: 'Gem. opslagtemp.',
    avgStorageMoisture: 'Gem. opslagvocht',
    smartExtraction: 'Smart Extractie',
    photoOfCargo: 'Foto van lading',
    customerSignature: 'Handtekening klant',
    personnel: 'Personeel',
    pickupPerson: 'Ophaalmedewerker',
    processPerson: 'Verwerkingsmedewerker',
    deliveryPerson: 'Bezorgmedewerker',
    notProvided: '—',
    noResults: 'Geen trackingrecord gevonden voor dit ID',
    searchPlaceholder: 'Voer tracking ID in',
  },
  de: {
    trackingId: 'Sendungsnummer',
    status: 'Status',
    delivered: 'Zugestellt',
    inTransit: 'Unterwegs',
    from: 'Von',
    to: 'Nach',
    address: 'Adresse',
    estimatedDelivery: 'Voraussichtliche Lieferung',
    lastUpdate: 'Letzte Aktualisierung',
    farmToFork: 'Countdown vom Hof auf den Tisch',
    timeline: 'Verlauf',
    pickupFromFarm: 'Abholung vom Hof',
    processedAtHub: 'Bearbeitet im MR Hub',
    dispatchedFromHub: 'Versand aus MR Hub',
    arrivalAtWarehouse: 'Ankunft im Lager',
    deliveredEvent: 'Zugestellt',
    showFullDetails: 'Alle Details anzeigen',
    hideFullDetails: 'Details ausblenden',
    qualityAnalysis: 'Qualitätsanalyse',
    batchId: 'Chargennummer',
    ashContent: 'Aschegehalt',
    proteinContent: 'Proteingehalt',
    moistureContent: 'Feuchtigkeitsgehalt',
    zeleny: 'Zeleny-Sedimentation',
    fallingNumber: 'Fallzahl',
    avgStorageTemp: 'Durchschn. Lagertemp.',
    avgStorageMoisture: 'Durchschn. Lagerfeuchte',
    smartExtraction: 'Smart Extraction',
    photoOfCargo: 'Foto der Fracht',
    customerSignature: 'Kundenunterschrift',
    personnel: 'Personal',
    pickupPerson: 'Abholer',
    processPerson: 'Bearbeiter',
    deliveryPerson: 'Zusteller',
    notProvided: '—',
    noResults: 'Kein Sendungsverlauf für diese ID gefunden',
    searchPlaceholder: 'Sendungsnummer eingeben',
  },
  fr: {
    trackingId: 'ID de suivi',
    status: 'Statut',
    delivered: 'Livré',
    inTransit: 'En transit',
    from: 'De',
    to: 'À',
    address: 'Adresse',
    estimatedDelivery: 'Livraison estimée',
    lastUpdate: 'Dernière mise à jour',
    farmToFork: 'Compte à rebours de la ferme à la table',
    timeline: 'Historique',
    pickupFromFarm: 'Ramassage à la ferme',
    processedAtHub: 'Traité au MR Hub',
    dispatchedFromHub: 'Expédié du MR Hub',
    arrivalAtWarehouse: 'Arrivée à l’entrepôt',
    deliveredEvent: 'Livré',
    showFullDetails: 'Afficher tous les détails',
    hideFullDetails: 'Masquer les détails',
    qualityAnalysis: 'Analyse de qualité',
    batchId: 'Numéro de lot',
    ashContent: 'Teneur en cendres',
    proteinContent: 'Teneur en protéines',
    moistureContent: 'Teneur en humidité',
    zeleny: 'Sédimentation Zeleny',
    fallingNumber: 'Indice de chute',
    avgStorageTemp: 'Temp. de stockage moy.',
    avgStorageMoisture: 'Humidité de stockage moy.',
    smartExtraction: 'Extraction intelligente',
    photoOfCargo: 'Photo de la cargaison',
    customerSignature: 'Signature du client',
    personnel: 'Personnel',
    pickupPerson: 'Ramasseur',
    processPerson: 'Opérateur',
    deliveryPerson: 'Livreur',
    notProvided: '—',
    noResults: 'Aucun enregistrement de suivi trouvé pour cet ID',
    searchPlaceholder: 'Entrez l’ID de suivi',
  },
};

// ---------- 辅助函数 ----------
const formatTimestamp = (ts) => {
  if (!ts) return null;
  const date = new Date(ts);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', ' ·');
};

const getLastUpdate = (fields) => {
  const timestamps = [
    fields['Pickup From Farm On'],
    fields['Process Date at MR Hub'],
    fields['Pickup Date at MR Hub'],
    fields['Arrival at Warehouse'],
    fields['Delivery Date'],
  ].filter(Boolean);
  return timestamps.length ? Math.max(...timestamps) : null;
};

// ---------- 主组件 ----------
const TrackingResult = ({ 
  item,                       // 当前搜索结果对象
  language = 'en',            // 当前语言
  setLanguage,               // 切换语言的函数（父组件提供）
  isExpanded,                // 是否展开详情
  toggleExpand,              // 切换展开状态
  resetSearch                // 返回搜索界面的函数（点击Logo时调用）
}) => {
  if (!item) return null;

  const t = translations[language] || translations.en;
  const fields = item.fields || {};

  // 核心字段提取
  const trackId = fields['Track ID']?.[0]?.text || item.id;
  const status = fields['Delivery Date'] ? t.delivered : t.inTransit;
  const farmName = fields['Farm Location']?.[0]?.text || t.notProvided;
  const warehouseName = fields['Warehouse Location']?.name || t.notProvided;
  const fullAddress = fields['Warehouse Location']?.full_address || '';
  const deliveryDate = fields['Delivery Date'] ? formatTimestamp(fields['Delivery Date']) : null;
  const lastUpdateTs = getLastUpdate(fields);
  const lastUpdate = lastUpdateTs ? formatTimestamp(lastUpdateTs) : t.notProvided;
  const farmToFork = fields['Farm to Fork Countdown']?.[0]?.text || t.notProvided;

  // 质量参数（用于展开区域）
  const qualityParams = [
    { label: t.batchId, value: fields['Batch ID'] },
    { label: t.ashContent, value: fields['Ash Content'] ? `${fields['Ash Content']}%` : null },
    { label: t.proteinContent, value: fields['Protein Content At Farm %'] ? `${fields['Protein Content At Farm %']}%` : null },
    { label: t.moistureContent, value: fields['Moisture Content At Farm %'] ? `${fields['Moisture Content At Farm %']}%` : null },
    { label: t.zeleny, value: fields['Zeleny Sedimentation'] },
    { label: t.fallingNumber, value: fields['Falling number'] },
    { label: t.avgStorageTemp, value: fields['Average Storage Temperature'] ? `${fields['Average Storage Temperature']}°C` : null },
    { label: t.avgStorageMoisture, value: fields['Average Storage Moisture'] ? `${fields['Average Storage Moisture']}%` : null },
    { label: t.smartExtraction, value: fields['Smart Extraction'] },
  ].filter(p => p.value != null && p.value !== ''); // 只显示有值的字段

  // 时间线事件
  const timelineEvents = [
    { time: fields['Pickup From Farm On'], label: t.pickupFromFarm, location: farmName },
    { time: fields['Process Date at MR Hub'], label: t.processedAtHub, location: 'MR Processing Center' },
    { time: fields['Pickup Date at MR Hub'], label: t.dispatchedFromHub, location: 'MR Processing Center' },
    { time: fields['Arrival at Warehouse'], label: t.arrivalAtWarehouse, location: warehouseName },
    { time: fields['Delivery Date'], label: t.deliveredEvent, location: warehouseName },
  ]
    .filter(event => event.time) // 只显示有时间的事件
    .sort((a, b) => a.time - b.time); // 按时间升序

  // 图片数组
  const cargoPhotos = fields['Photo Of Cargo'] || [];
  const signatureImages = fields['Cusomer Signature'] || [];

  // 人员信息
  const pickupPerson = fields['Pickup Person']?.[0];
  const processPerson = fields['Process Person']?.[0];
  const deliveryPerson = fields['Delivery Person']?.[0];

  // 处理图片加载错误
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder.png'; // 请确保 public 目录有此文件
  };

  return (
    <div className="tracking-result">
      {/* 核心信息卡片 */}
      <div className="info-card">
        <div className="tracking-header">
          <div className="tracking-id-wrapper">
            <span className="label">{t.trackingId}</span>
            <span className="value">{trackId}</span>
          </div>
          <span className={`status-badge ${fields['Delivery Date'] ? 'delivered' : 'in-transit'}`}>
            {status}
          </span>
        </div>

        <div className="route-info">
          <div className="from-to">
            <div className="location">
              <span className="label">{t.from}</span>
              <span className="value">{farmName}</span>
            </div>
            <div className="location">
              <span className="label">{t.to}</span>
              <span className="value">{warehouseName}</span>
            </div>
          </div>
          {fullAddress && (
            <div className="full-address">
              <span className="label">{t.address}</span>
              <span className="value">{fullAddress}</span>
            </div>
          )}
        </div>

        <div className="delivery-info">
          {deliveryDate && (
            <div>
              <span className="label">{t.estimatedDelivery}</span>
              <span className="value">{deliveryDate}</span>
            </div>
          )}
          <div>
            <span className="label">{t.lastUpdate}</span>
            <span className="value">{lastUpdate}</span>
          </div>
          <div>
            <span className="label">{t.farmToFork}</span>
            <span className="value">{farmToFork}</span>
          </div>
        </div>
      </div>

      {/* 时间线 */}
      <div className="timeline-card">
        <h3>{t.timeline}</h3>
        <div className="timeline">
          {timelineEvents.map((event, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-time">{formatTimestamp(event.time)}</div>
                <div className="timeline-label">{event.label}</div>
                <div className="timeline-location">{event.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 展开/折叠按钮 */}
      <button className="expand-button" onClick={toggleExpand}>
        {isExpanded ? t.hideFullDetails : t.showFullDetails}
      </button>

      {/* 展开区域：质量参数、图片、人员 */}
      {isExpanded && (
        <div className="expanded-details">
          {/* 质量分析 */}
          {qualityParams.length > 0 && (
            <div className="quality-section">
              <h3>{t.qualityAnalysis}</h3>
              <div className="quality-grid">
                {qualityParams.map((param, idx) => (
                  <div key={idx} className="quality-item">
                    <span className="quality-label">{param.label}</span>
                    <span className="quality-value">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 货物照片 */}
          {cargoPhotos.length > 0 && (
            <div className="photos-section">
              <h3>{t.photoOfCargo}</h3>
              <div className="photo-grid">
                {cargoPhotos.map((photo, idx) => (
                  <div key={idx} className="photo-item">
                    <img
                      src={photo.url || photo.tmp_url}
                      alt="Cargo"
                      onError={handleImageError}
                      loading="lazy"
                      onClick={() => window.open(photo.url || photo.tmp_url, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 客户签名 */}
          {signatureImages.length > 0 && (
            <div className="signature-section">
              <h3>{t.customerSignature}</h3>
              <div className="signature-grid">
                {signatureImages.map((sig, idx) => (
                  <div key={idx} className="signature-item">
                    <img
                      src={sig.url || sig.tmp_url}
                      alt="Customer signature"
                      onError={handleImageError}
                      loading="lazy"
                      onClick={() => window.open(sig.url || sig.tmp_url, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 人员信息 */}
          {(pickupPerson || processPerson || deliveryPerson) && (
            <div className="personnel-section">
              <h3>{t.personnel}</h3>
              <div className="personnel-grid">
                {pickupPerson && (
                  <div className="personnel-item">
                    <span className="personnel-role">{t.pickupPerson}</span>
                    <span className="personnel-name">{pickupPerson.name}</span>
                    <span className="personnel-email">{pickupPerson.email}</span>
                  </div>
                )}
                {processPerson && (
                  <div className="personnel-item">
                    <span className="personnel-role">{t.processPerson}</span>
                    <span className="personnel-name">{processPerson.name}</span>
                    <span className="personnel-email">{processPerson.email}</span>
                  </div>
                )}
                {deliveryPerson && (
                  <div className="personnel-item">
                    <span className="personnel-role">{t.deliveryPerson}</span>
                    <span className="personnel-name">{deliveryPerson.name}</span>
                    <span className="personnel-email">{deliveryPerson.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingResult;
