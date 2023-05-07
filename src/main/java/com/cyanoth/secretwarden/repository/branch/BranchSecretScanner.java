package com.cyanoth.bitbucketplugin.repository.branch;

import com.cyanoth.bitbucketplugin.SecretScanException;
import com.cyanoth.bitbucketplugin.SecretScanResult;
import com.cyanoth.bitbucketplugin.SecretScanner;

/**
 * Secret Scanner for scanning repository branches.
 */
public class BranchSecretScanner implements SecretScanner {
    @Override
    public SecretScanResult scan(Boolean force) throws SecretScanException {
        return null;
    }
}
