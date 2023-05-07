package com.cyanoth.bitbucketplugin.repository;

import com.cyanoth.bitbucketplugin.SecretScanException;
import com.cyanoth.bitbucketplugin.SecretScanResult;
import com.cyanoth.bitbucketplugin.SecretScanner;

/**
 * Secret Scanner for scanning Repositories
 */
public class RepositorySecretScanner implements SecretScanner {

    @Override
    public SecretScanResult scan(Boolean force) throws SecretScanException {
        return null;
    }
}
