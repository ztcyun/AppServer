﻿/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


using System;

using ASC.Common;
using ASC.Common.Logging;
using ASC.Common.Threading.Progress;
using ASC.Core;
using ASC.Data.Storage.Configuration;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ASC.Data.Storage.Migration
{
    public class MigrationService : IService
    {
        public StorageUploader StorageUploader { get; }
        public StaticUploader StaticUploader { get; }
        public StorageFactoryConfig StorageFactoryConfig { get; }
        public IServiceProvider ServiceProvider { get; }
        public ILog Log { get; }

        public MigrationService(
            StorageUploader storageUploader,
            StaticUploader staticUploader,
            StorageFactoryConfig storageFactoryConfig,
            IServiceProvider serviceProvider,
            IOptionsMonitor<ILog> options)
        {
            StorageUploader = storageUploader;
            StaticUploader = staticUploader;
            StorageFactoryConfig = storageFactoryConfig;
            ServiceProvider = serviceProvider;
            Log = options.Get("ASC.Data.Storage.Migration");
        }

        public void Migrate(int tenantId, StorageSettings newStorageSettings)
        {
            StorageUploader.Start(tenantId, newStorageSettings, StorageFactoryConfig);
        }

        public void UploadCdn(int tenantId, string relativePath, string mappedPath, CdnStorageSettings cdnStorageSettings = null)
        {
            using var scope = ServiceProvider.CreateScope();
            var tenantManager = scope.ServiceProvider.GetService<TenantManager>();
            tenantManager.SetCurrentTenant(tenantId);

            StaticUploader.UploadDir(relativePath, mappedPath);
            Log.DebugFormat("UploadDir {0}", mappedPath);
        }

        public double GetProgress(int tenantId)
        {
            var progress = (ProgressBase)StorageUploader.GetProgress(tenantId) ?? StaticUploader.GetProgress(tenantId);

            return progress != null ? progress.Percentage : -1;
        }

        public void StopMigrate()
        {
            StorageUploader.Stop();
        }
    }

    public static class MigrationServiceExtension
    {
        public static DIHelper AddMigrationService(this DIHelper services)
        {
            services.TryAddSingleton<MigrationService>();

            return services
                .AddStaticUploaderService()
                .AddStorageFactoryConfigService();
        }
    }
}
